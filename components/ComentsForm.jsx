"use client";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa6";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Toast from '@/components/Toast';

export default function ComentsForm({pubId}) {
  //HOOKS
  const { status } = useSession();
  const router = useRouter();
  const [commentTxt, setCommentTxt] = useState("");
  const [loaderComment, setLoaderComment] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  function toaster(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  async function upComment(e, type) {
    e.preventDefault();
    if ((status == 'unauthenticated')) return;
    setLoaderComment(true);
    const form = new FormData();
    form.append("id", pubId);
    switch(type) {
      case 'TEXT':
        if(!commentTxt) return;
        if(commentTxt.length > 500) {
          alert('El texto es muy largo');
          return;
        }
        form.append("comment", commentTxt.trim());
        break;
      case 'IMG':
        const file = e.target.files[0];
        if(!file || file.length == 0) return;
        if(!/^image/.test(file.type)) {
          alert('Suba una imágen porfavor');
          return;
        }
        if(file.size > 4000000) {
          alert('El archivo es muy grande, max 4MB');
          return;
        }
        form.append('file', file);
        break;
      default: return;
    }
    const res = await fetch("/api/upComment", {
      method: "POST",
      body: form,
    });
    setCommentTxt("");
    if (!res.ok) throw "error";
    const response = await res.json();
    setLoaderComment(false);
    if (response.msg == "OK") {
      toaster('El comentario se publicó exitosamente');
      router.refresh();
      return;
    } else {
      toaster('El comentario no se pudo publicar');
      return;
    }
  }

  return (
    <>
    {status == 'authenticated' && (
      <form onSubmit={e => upComment(e, 'TEXT')} className="w-full flex gap-4 items-center pt-2">
      {toastMsg && <Toast msg={toastMsg}/>}
      <div className="commentBX w-full flex justify-between items-center gap-3">
        <input
          type="text"
          placeholder="Escribe un comentario"
          maxLength="500"
          minLength="1"
          required
          className={`bg-slate-300 w-full py-2 px-4 rounded-lg focus:outline-none text-slate-950 ${commentTxt.length > 500 && 'ring-2 ring-red-600 bg-red-200'}`}
          value={commentTxt}
          onChange={(e) => setCommentTxt(e.target.value)}
          disabled={status == 'unauthenticated' ? true : false}
        />
        <input type="file" id={pubId} hidden accept="image/*" onChange={e => upComment(e, 'IMG')}/>
        <label htmlFor={pubId} className="">
          <FaImage className="text-black cursor-pointer size-5"/>
        </label>
      </div>
      {loaderComment ? (
        <FaSpinner className="animate-spin" color="white" size={20} />
      ) : (
        <button className={`${status == 'unauthenticated' && 'pointer-events-none'}`}>
          <FaPaperPlane
            color="black"
            size={20}
            className='cursor-pointer hover:animate-pulse'
          />
        </button>
      )}
    </form>
    )}   
    </>
  );
}
