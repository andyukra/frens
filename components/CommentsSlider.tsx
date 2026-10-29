"use client";

import { useCommentsBox } from "@/lib/stores/dialogs";
import { useEffect } from 'react';
//COMPONENTS AND UI
import { FaTimes } from "react-icons/fa";
import Comentary from "@/components/Comentary";
import ComentsForm from "@/components/ComentsForm";

export default function CommentsSlider() {
  //HOOKS
  const { comments, pubId, clearData } = useCommentsBox();
  //FIX SCROLL ON COMMENTS VIEW
  useEffect(() => {
    if(pubId) {
      document.body.style.position = 'fixed';
    } else {
      document.body.style.position = 'static';
    }
  }, [pubId])
  //RENDER
  return (
    <>
      {comments && pubId && (
        <div 
          className="fixed backdrop-blur-sm top-0 left-0 w-[100dvw] h-[100dvh] flex z-[100] justify-center">
          <div 
            //@ts-ignore
            style={{cornerShape: 'squircle', borderTopRightRadius: '3rem', borderTopLeftRadius: '3rem'}}
            className="fade-in-entry absolute md:w-[50%] w-[100%] md:h-[70%] h-[70%] bottom-0 bg-slate-950 p-4">
            <button onClick={() => clearData()}>
              <FaTimes
                color="gray"
                className="absolute top-6 right-6"
                size={25}
              />
            </button>
            <h1 className="text-xl text-center mt-[-20px] font-bold">Comentarios</h1>
            <div className="overflow-auto h-full pb-6 mt-2 flex flex-col justify-between">
              {comments.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <h4 className="text-center text-lg font-medium text-yellow-100">
                    No hay comentarios
                  </h4>
                </div>
              ) : (
                <div className="flex flex-col">
                  {[...comments].reverse().map((comment, key) => (
                    <Comentary key={key} elem={comment} />
                  ))}
                </div>
              )}
              {/* FORM */}
              <div className="mb-5">
                <ComentsForm pubId={pubId} cb={() => {}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
