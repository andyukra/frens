"use client";

import { useCommentsBox } from "@/lib/stores/dialogs";
//COMPONENTS AND UI
import { FaTimes } from "react-icons/fa";
import Comentary from "@/components/Comentary";
import ComentsForm from "@/components/ComentsForm";

export default function CommentsSlider() {
  //HOOKS
  const { comments, pubId, clearData } = useCommentsBox();
  //RENDER
  return (
    <>
      {comments && pubId && (
        <div 
          className="fixed top-0 left-0 w-[100dvw] h-[100dvh] flex z-[100] justify-center">
          <div className="fade-in-entry absolute md:w-[50%] w-[95%] md:h-[50%] h-[90%] bottom-0 shadow bg-black rounded-t-3xl p-4">
            <button onClick={() => clearData()}>
              <FaTimes
                color="gray"
                className="absolute top-6 right-6"
                size={25}
              />
            </button>
            <h1 className="text-xl text-center mt-[-15px] font-bold">Comentarios</h1>
            <div className="overflow-auto h-full pb-6">
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
              <div className="p-4">
                <ComentsForm pubId={pubId} cb={() => {}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
