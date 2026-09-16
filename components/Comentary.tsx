'use client';
import moment from "moment";
import { useImageViewer } from '@/lib/stores/dialogs';
import React from 'react';
//COMPONENTS
import CardHeader from "@/components/CardHeader";

moment.locale("es");

//TYPES
type Comment = {
  avatar: string,
  author: string,
  date: Date,
  msg: string,
};
//HELPERS
function filterMsg(msg: string, setData: (url: string, alt: string) => void) {
  if (/.*\.(jpg|gif|png|jpeg|tiff|heif|bmp|webp)$/i.test(msg)) {
    return (
      <button className="w-full" onClick={() => setData(msg, "comentario con imágen")}>
        <img
          src={msg}
          alt="comentario con imagen"
          className="max-w-[200px] max-h-[400px] rounded-lg"
        />
      </button>
    );
  } else {
    return (
      <p className="p-3 rounded-lg bg-slate-200 text-black break-word">{msg}</p>
    );
  }
}

export default function Comentary({ elem }: {elem:Comment}) {
  const { setData: setImageData } = useImageViewer();
  return (
    <article
      className="my-4 py-2 px-4 rounded-lg"
    >
      {/* HEADER */}
	  <CardHeader pub={elem} pubDate={moment(elem.date).fromNow()} />
      {/* BODY */}
      <div>{filterMsg(elem.msg, setImageData)}</div>
    </article>
  );
}
