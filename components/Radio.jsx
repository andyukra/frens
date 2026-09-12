'use client';

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { useState, useRef } from 'react';

export default function Radio() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  //HANDLERS
  function playStopToggle(state) {
    if(state == 'play') {
      audioRef.current.play();
      setIsPlaying(true);
    }
    if(state == 'stop') {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div
      className="h-[100px] w-full py-2 px-5 flex items-center justify-between rounded-lg shadow-md"
    >
      <div className="btns">
        {isPlaying ? (
          <FaStopCircle size={70} className="animate-pulse cursor-pointer drop-shadow-md" onClick={() => playStopToggle('stop')}/>
        ) : (
          <FaPlayCircle size={70} className="animate-pulse cursor-pointer drop-shadow-md" onClick={() => playStopToggle('play')}/>
        )}
      </div>
      <div className="descrip flex items-center flex-col">
        <h3 className="text-xl font-bold drop-shadow-md">Radio Dj NaKo</h3>
        <p className="drop-shadow-md">chat desmadres</p>
      </div>
      <div className="logo md:block hidden">
        <img src="/desmadres.avif" alt="logo chat desmadres" width={200}/>
      </div>
      <audio src="https://stream.zeno.fm/gkvdqocej4rtv" ref={audioRef}></audio>
    </div>
  )
}
