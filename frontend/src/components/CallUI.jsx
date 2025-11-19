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
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
    if (remoteVideoRef.current && remoteStream.current) {
      remoteVideoRef.current.srcObject = remoteStream.current;
    }
  });

  // ------------------------
  // Incoming call UI
  // ------------------------
  if (incomingCall && !isCalling && !isInCall) {
    console.log(incomingCall);
    
    return (
      <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-50">
        <h2 className="text-xl mb-4">{incomingCall.fromName} is calling…</h2>

        <div className="flex gap-6 mt-6">
          <button
            onClick={acceptCall}
            className="bg-green-600 p-4 rounded-full"
          >
            <Phone className="text-white" />
          </button>

          <button
            onClick={rejectCall}
            className="bg-red-600 p-4 rounded-full"
          >
            <PhoneOff className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  // ------------------------
  // OUTGOING RINGING UI
  // ------------------------
  if (isCalling && !isInCall) {
    return (
      <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-50">
        <h2 className="text-xl">Calling…</h2>

        <button
          onClick={endCall}
          className="mt-6 bg-red-600 p-4 rounded-full"
        >
          <PhoneOff />
        </button>
      </div>
    );
  }

  // ------------------------
  // ACTIVE CALL SCREEN
  // ------------------------
  if (isInCall) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Local video preview */}
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

  return null;
}
