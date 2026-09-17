"use client";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa6";
import { useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { Turnstile } from "nextjs-turnstile";
import { UpComment } from "@/app/actions/serverActions";
//COMPONENTS
import Toast from "@/components/Toast";

//TYPES
type Props = {
  pubId: string;
  cb: (txt: string) => void;
};
type TypeComment = "TEXT" | "IMG";
//MAIN FC
export default function ComentsForm({ pubId, cb }: Props) {
  //HOOKS
  const { status } = useSession();
  const [commentTxt, setCommentTxt] = useState("");
  const [loaderComment, setLoaderComment] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [token, setToken] = useState<string | null>(null);

  function toaster(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  async function upComment(e: React.SyntheticEvent, type: TypeComment) {
    e.preventDefault();
    if (!token) {
      alert("Por favor completa el CAPTCHA");
      return;
    }
    if (status == "unauthenticated") return;
    if (loaderComment) return;
    setLoaderComment(true);
    const form = new FormData();
    form.append("id", pubId);
    form.append("token", token);
    switch (type) {
      case "TEXT":
        if (!commentTxt) return;
        if (commentTxt.length > 500) {
          alert("El texto es muy largo");
          return;
        }
        form.append("comment", commentTxt.trim());
        break;
      case "IMG":
        //@ts-ignore
        const file = e.target.files[0];
        if (!file || file.length == 0) return;
        if (!/^image/.test(file.type)) {
          alert("Suba una imágen porfavor");
          return;
        }
        if (file.size > 4000000) {
          alert("El archivo es muy grande, max 4MB");
          return;
        }
        form.append("file", file);
        break;
      default:
        return;
    }
    const res = await UpComment(form);
    setCommentTxt("");
    if (
      !res ||
      res.hasOwnProperty("err") ||
      !res.hasOwnProperty("msg") ||
      !res.hasOwnProperty("comment")
    ) {
      toaster("El comentario no se pudo publicar");
      throw "error";
    }
    setLoaderComment(false);
    toaster("El comentario se publicó exitosamente");
    cb(res.comment as string);
  }

  return (
    <>
      {status == "authenticated" && (
        <>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={setToken}
          onError={() => console.error("Error en Turnstile")}
          onExpire={() => setToken(null)}
        />
        <form
          onSubmit={(e) => upComment(e, "TEXT")}
          className="w-full flex gap-4 items-center pt-2"
        >
          {toastMsg && <Toast msg={toastMsg} />}
          <div className="commentBX w-full flex justify-between items-center gap-3">
            <input
              type="text"
              placeholder="Escribe un comentario"
              maxLength={500}
              minLength={1}
              required
              className={`bg-white w-full py-2 px-4 rounded-lg focus:outline-none text-black ${commentTxt.length > 500 && "ring-2 ring-red-600 bg-red-200"}`}
              value={commentTxt}
              disabled={!token}
              onChange={(e) => setCommentTxt(e.target.value)}
            />
            <input
              disabled={!token}
              type="file"
              id={pubId}
              hidden
              accept="image/*"
              onChange={(e) => upComment(e, "IMG")}
            />
            <label htmlFor={pubId} className="">
              <FaImage className="text-white cursor-pointer size-5" />
            </label>
          </div>
          {loaderComment ? (
            <FaSpinner className="animate-spin text-white" size={20} />
          ) : (
            <button disabled={!token}>
              <FaPaperPlane
                size={20}
                className="cursor-pointer hover:animate-pulse text-white"
              />
            </button>
          )}
        </form>
        </>
      )}
    </>
  );
}
