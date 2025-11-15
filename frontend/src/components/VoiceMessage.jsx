import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause } from "lucide-react";

export default function VoiceMessage({ audioUrl, duration }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,

      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 22,

      waveColor: "#7f8ea3",     

      cursorWidth: 0,          
      normalize: true,
      responsive: true,
    });

    wavesurfer.current.load(audioUrl);

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);

      // reset color when finished
      wavesurfer.current.setOptions({ waveColor: "#7f8ea3" });
      wavesurfer.current.seekTo(0);
    });

    return () => wavesurfer.current.destroy();
  }, [audioUrl]);


   const togglePlay = () => {
    if (!wavesurfer.current) return;

    const playing = wavesurfer.current.isPlaying();
    wavesurfer.current.playPause();

    if (!playing) {
      // 🔵 change entire waveform to blue when playing
      wavesurfer.current.setOptions({ waveColor: "#3b82f6" });
    } else {
      // 🔘 revert to grey when paused
      wavesurfer.current.setOptions({ waveColor: "#7f8ea3" });
    }

    setIsPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3 w-full h-12 px-4">

      {/* Play button */}
      <button
        onClick={togglePlay}
        className="p-2 bg-blue-500 text-white rounded-full"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      {/* Waveform */}
      <div className="flex-1 flex items-center">
        <div ref={waveformRef} className="w-full" />
      </div>

      {/* Duration */}
      <span className="text-xs opacity-60">
        {Math.round(duration)}s
      </span>

    </div>
  );
}
