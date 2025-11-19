import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useSelector } from "react-redux";

const useWebRTC = ({ userId, chatId, socket }) => {
  if (!socket) {
    console.warn("WebRTC: socket not ready yet");
  }
  
  const pc = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const incomingAudio  = useRef(new Audio("/sounds/ringtone-1.mp3"));
  incomingAudio.current.loop = true;

  const [isCalling, setIsCalling] = useState(false);      // outgoing ringing
  const [incomingCall, setIncomingCall] = useState(null); // { from, offer, type }
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState("video");      // "audio" or "video"
  const [callStartTime, setCallStartTime] = useState(null);

  const {authUser} = useSelector((state) => state.auth);
  // ----------------------------
  // Load ICE servers
  // ----------------------------
  const loadIceServers = async () => {
    try {
      const res = await axiosInstance.get("/webrtc/ice");
      return { iceServers: res.data.iceServers };
    } catch {
      return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    }
  };

  // ----------------------------
  // Create PeerConnection
  // ----------------------------
  const initCall = async (mediaType = "video") => {
    if (pc.current) return; // prevent duplicates
    const iceConfig = await loadIceServers();

    pc.current = new RTCPeerConnection(iceConfig);

    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: mediaType === "video",
      audio: true,
    });

    remoteStream.current = new MediaStream();

    // Attach tracks
    localStream.current.getTracks().forEach((track) => {
      pc.current.addTrack(track, localStream.current);
    });

    // On remote track
    pc.current.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) =>
        remoteStream.current.addTrack(t)
      );
    };

    // ICE candidates
    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("call:ice-candidate", {
          toUserId: userId,
          candidate: e.candidate,
        });
      }
    };
  };

  // ----------------------------
  // OUTGOING CALL
  // ----------------------------
  const startCall = async (type = "video") => {
  if (!socket) return;

  if (pc.current) {
    console.warn("PC already exists → preventing duplicate call");
    return;
  }

  await initCall(type);
  setCallType(type);
  setIsCalling(true);

  if (pc.current.signalingState === "have-local-offer") {
    console.warn("Offer already created, skipping...");
    return;
  }

  const offer = await pc.current.createOffer();

  await pc.current.setLocalDescription(offer);

  socket.emit("call:offer", {
    from: authUser._id,
    toUserId: userId,
    offer,
    type
  });
 }


  // ----------------------------
  // INCOMING CALL (triggered from socket)
  // ----------------------------
  useEffect(() => {
    if (!socket) return;

    

    socket.on("call:offer", ({ from, fromName, offer, type }) => {
      setIncomingCall({ from, fromName, offer, type });
      incomingAudio.current.currentTime = 0;
      incomingAudio.current.play().catch(()=>{console.log("audio error")});
      
    });

    socket.on("call:answer", async ({ from, answer }) => {
      // only handle if this is the correct user answering
      if (from !== userId) return;

      if (pc.current) {
        await pc.current.setRemoteDescription(answer);
      }
      setIsInCall(true);
      setIsCalling(false);
      setCallStartTime(Date.now());

    });

    socket.on("call:ice-candidate", async ({ candidate }) => {
      try {
        if (pc.current && candidate) {
          await pc.current.addIceCandidate(candidate);
        }
      } catch {}
    });

    socket.on("call:end", () => {
      endCall(false);
    });

    return () => {
      socket.off("call:offer");
      socket.off("call:answer");
      socket.off("call:ice-candidate");
      socket.off("call:end");
    };
  }, [socket]);

  // ----------------------------
  // ACCEPT CALL
  // ----------------------------
  const acceptCall = async () => {
    if (!incomingCall) return;

    incomingAudio.current.pause();
    incomingAudio.current.currentTime = 0;

    const { offer, from, type } = incomingCall;

    await initCall(type);
    setCallType(type);

    // Apply remote offer
    await pc.current.setRemoteDescription(offer);

    // Answer
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    socket.emit("call:answer", { toUserId: from, answer });

    setIncomingCall(null);
    setIsInCall(true);
    setCallStartTime(Date.now());
  };

  // ----------------------------
  // REJECT CALL
  // ----------------------------
  const rejectCall = async() => {
    if (!incomingCall) return;

    incomingAudio.current.pause();
    incomingAudio.current.currentTime = 0;

    // api
    try {
      if (chatId) {
        await axiosInstance.post(`/messages/call/${chatId}`, {
          callType,
          callDuration: 0,
          callStatus: "declined",
        });
      }
    } catch (err) {
      console.log("Failed to save call log", err);
    }

    socket.emit("call:reject", { toUserId: incomingCall.from });
    setIncomingCall(null);
  };

  // ----------------------------
  // END CALL
  // ----------------------------
  const endCall = async (sendSignal = true) => {
    
    // Calculate duration
    let duration = 0;
    if (callStartTime) {
      duration = Math.floor((Date.now() - callStartTime) / 1000);
    }

    // Stop media
    localStream.current?.getTracks().forEach((t) => t.stop());
    localStream.current = null;
    remoteStream.current = null;

    // Close PC
    pc.current?.close();
    pc.current = null;

    // Inform remote
    if (sendSignal) {
      socket.emit("call:end", { toUserId: userId });
    }

    // Save call-log message
    try {
      if (chatId) {
        await axiosInstance.post(`/messages/call/${chatId}`, {
          callType,
          callDuration: duration,
          callStatus: "ended",
        });
      }
    } catch (err) {
      console.log("Failed to save call log", err);
    }

    setIsCalling(false);
    setIsInCall(false);
    setIncomingCall(null);
    setCallStartTime(null);
  };

  return {
    // STATE
    localStream,
    remoteStream,
    incomingCall,
    isCalling,
    isInCall,
    callType,

    // ACTIONS
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  };
}

export default useWebRTC;
