import React, { useEffect, useRef } from "react";
import { Phone, PhoneOff, Video, Mic, MicOff } from "lucide-react";

export default function CallUI({
  incomingCall,
  isCalling,
  isInCall,
  localStream,
  remoteStream,
  acceptCall,
  rejectCall,
  endCall,
  callType,      // <-- IMPORTANT
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (callType === "video") {
      if (localVideoRef.current && localStream.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
      if (remoteVideoRef.current && remoteStream.current) {
        remoteVideoRef.current.srcObject = remoteStream.current;
      }
    }
  });

  // ------------------------------------------
  // INCOMING CALL
  // ------------------------------------------
  if (incomingCall && !isCalling && !isInCall) {
    return (
      <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-50">
        <h2 className="text-xl mb-4">
          {incomingCall.fromName} is calling…
        </h2>

        {/* Show audio or video icons */}
        <div className="text-5xl mb-4">
          {incomingCall.type === "audio" ? <Mic /> : <Video />}
        </div>

        <div className="flex gap-6 mt-6">
          <button onClick={acceptCall} className="bg-green-600 p-4 rounded-full">
            <Phone className="text-white" />
          </button>

          <button onClick={rejectCall} className="bg-red-600 p-4 rounded-full">
            <PhoneOff className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // OUTGOING CALL
  // ------------------------------------------
  if (isCalling && !isInCall) {
    return (
      <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-50">
        <h2 className="text-xl">Calling…</h2>

        {/* Show audio/video icon */}
        <div className="text-5xl mt-2">
          {callType === "audio" ? <Mic /> : <Video />}
        </div>

        <button
          onClick={endCall}
          className="mt-6 bg-red-600 p-4 rounded-full"
        >
          <PhoneOff />
        </button>
      </div>
    );
  }

  // ------------------------------------------
  // ACTIVE VIDEO CALL UI
  // ------------------------------------------
  if (isInCall && callType === "video") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Local preview */}
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-32 h-48 absolute bottom-5 right-5 rounded-md object-cover border"
        />

        {/* Controls */}
        <div className="absolute bottom-10 w-full flex justify-center gap-6">
          <button
            onClick={endCall}
            className="bg-red-600 p-4 rounded-full"
          >
            <PhoneOff className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // ACTIVE AUDIO CALL UI
  // ------------------------------------------
  if (isInCall && callType === "audio") {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-50">

        {/* Avatar Placeholder */}
        <div className="w-40 h-40 bg-slate-700 rounded-full flex items-center justify-center mb-6">
          <Mic className="w-20 h-20 text-slate-300" />
        </div>

        <h2 className="text-2xl mb-2">In Audio Call</h2>

        {/* Controls */}
        <div className="flex gap-6 mt-6">
          <button
            onClick={endCall}
            className="bg-red-600 p-4 rounded-full"
          >
            <PhoneOff className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
