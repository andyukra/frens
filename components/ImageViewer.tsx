"use client";
import { FaTimes } from "react-icons/fa";
import { useImageViewer } from "@/lib/stores/dialogs";
import { useLayoutEffect } from 'react';
//GLOBAL VARS
let scrollY: number = 0;
//MAIN FC
export default function ImageViewer() {
  const { url, alt, clearData } = useImageViewer();
  useLayoutEffect(() => {
    if(url) {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
    } else {
      document.body.style.position = '';
      window.scrollTo(0, scrollY);
      scrollY = 0;
    }
  }, [url]);
  return (
    <>
      {url && alt && (
        <div className="fixed w-dvw h-dvh top-0 left-0 bg-[#000c] backdrop-blur-md flex items-center justify-center z-[101]">
          <button onClick={() => clearData()}>
            <FaTimes color="white" className="fixed top-6 right-6" size={30} />
          </button>
          <img
            //@ts-ignore
            style={{ cornerShape: "squircle", borderRadius: "1.2rem" }}
            className="w-auto h-auto max-w-[90dvw] max-h-[90dvh]"
            src={url}
            alt={alt}
          />
        </div>
      )}
    </>
  );
}
