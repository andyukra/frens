"use client";
import { useState } from "react";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa6";
//TYPES
type Props = { link: string }
//MAIN FC
export default function YtPlayer({ link }:Props) {
  const [state, setState] = useState(false);

  return (
    <>
      {state ? (
        <iframe
          className="w-full h-[500px]"
          src={`https://youtube.com/embed/${link}`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; web-share"
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      ) : (
        <div className="relative flex justify-center items-center">
          <Image
            src={`https://i.ytimg.com/vi/${link}/sd1.jpg`}
            width={640}
            height={480}
            className="w-full h-auto"
            alt="youtube player"
          />
          <FaYoutube
            onClick={() => setState(true)}
            className="absolute cursor-pointer drop-shadow-lg z-20"
            color={"#f33"}
            size={90}
          />
          <div className="absolute w-8 h-8 bg-white z-10"></div>
        </div>
      )}
    </>
  );
}
