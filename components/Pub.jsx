"use client";

import Link from "next/link";
import moment from "moment";
import "moment/locale/es";
import {
  FaEllipsis,
  FaRegThumbsUp,
  FaRegStar,
  FaRegComment,
  FaSpinner,
  FaArrowRightFromBracket,
  FaDeleteLeft,
} from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
//COMPONENTS
import YtPlayer from "@/components/YtPlayer";
import { like } from "@/app/actions/serverActions";
import Clipboard from "@/components/Clipboard";
import CardHeader from "@/components/CardHeader";

import ComentariesBox from "./ComentariesBox";

moment.locale("es");

export default function Pub({ info, type }) {
  //HOOKS
  info = JSON.parse(info);
  const { data: session } = useSession();
  const router = useRouter();
  const [comment, setComment] = useState(false);
  const [opts, setOpts] = useState(false);
  const [delLoader, setDelLoader] = useState(false);
  const [likes, setLikes] = useState(info.likes.length);
  const [likesDissable, setLikesDissable] = useState(false);

  async function deletePub(info) {
    if (info.author !== session?.user?.name) return;
    if (!confirm("Seguro que desea eliminar esto?")) return;
    setDelLoader(true);
    const type = info.image
      ? "image"
      : info.yt
        ? "yt"
        : info.audio
          ? "audio"
          : "text";
    let url = `/api/publicate?type=${type}&id=${info._id}`;
    if (type == "image") url += `&src=${info.image.match(/.{24}$/)[0]}`;
    if (type == "audio") url += `&src=${info.audio.match(/.{24}$/)[0]}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    //CLOSE MENU
    setOpts(false);
    setDelLoader(false);
    if (!res.ok) throw res;
    const response = await res.json();
    if (response.msg == "OK") router.refresh();
  }
  return (
    <article
      style={{ cornerShape: "squircle", borderRadius: "1rem" }}
      className={`my-4 inline-block w-full shadow-md bg-[#fafafa]`}
    >
      <div className="flex items-center justify-between py-2 pl-2 pr-4 border-b-[1px] border-solid border-slate-300">
        <CardHeader pub={info} pubDate={moment(info.date).fromNow()} />
        <div className="relative">
          {opts && (
            <ul className="absolute top-0 z-30 right-0 text-black p-2 w-[170px] rounded-lg shadow-md flex flex-col gap-1 items-center justify-center bg-white origin-top-right">
              <li className="w-full">
                <Link
                  href={`/pub?id=${info._id}`}
                  className="cursor-pointer hover:bg-slate-100 rounded w-full flex justify-between p-3"
                >
                  <p className="font-bold text-md">Visitar</p>
                  <FaArrowRightFromBracket color="black" size={20} />
                </Link>
              </li>
              <li className="cursor-pointer hover:bg-slate-100 rounded w-full flex justify-between p-3">
                <p className="font-bold text-md">Copiar link</p>
                <Clipboard pubId={info._id} color="black" />
              </li>
              {info.author === session?.user?.name && (
                <li
                  onClick={() => deletePub(info)}
                  className="cursor-pointer hover:bg-red-200 rounded w-full flex justify-between p-3"
                >
                  <p className="font-bold text-md text-red-500">Eliminar</p>
                  {delLoader == true ? (
                    <FaSpinner className="animate-spin" color="red" size={20} />
                  ) : (
                    <FaDeleteLeft color="red" size={20} />
                  )}
                </li>
              )}
              <li
                onClick={() => setOpts(false)}
                className="cursor-pointer bg-black rounded w-full flex justify-center p-1"
              >
                <p className="font-bold text-md text-white">Cancelar</p>
              </li>
            </ul>
          )}
          <FaEllipsis
            onClick={() => setOpts(!opts)}
            color="black"
            size={25}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div id="body">
        <div id="contentTxt" className="py-4 px-2">
          <h2 className="font-extrabold text-black text-xl p-2 border-l-[6px] border-solid border-black rounded-lg bg-slate-100">
            {info.title}
          </h2>
          {info?.description && type !== "portada" && (
            <p className="mt-4 rounded-lg px-3 font-bold text-slate-500">
              {info.description}
            </p>
          )}
        </div>
        {info?.image && (
          <div className="w-full">
            <img
              alt="imagen linda"
              src={info.image}
              className="w-full h-auto"
            />
          </div>
        )}
        {info?.yt && <YtPlayer link={info.yt} />}
        {info?.audio && (
          <audio
            src={info.audio}
            controls
            className="w-11/12 mx-auto my-4"
          ></audio>
        )}
      </div>
      <div className="flex items-center justify-around py-3 rounded-b-lg border-t-[1px] border-solid border-slate-300">
        <div className="flex gap-3">
          <FaRegThumbsUp
            onClick={async () => {
              if (likesDissable) return;
              const res = await like(info._id);
              if (res.status == "OK") {
                console.log(res);
                setLikes((prev) => prev + 1);
              } else {
                setLikesDissable(true);
              }
            }}
            color="black"
            size={20}
            className={`cursor-pointer hover:animate-pulse ${
              likesDissable ? "pointer-events-none" : ""
            }`}
          />
          <p className="font-bold text-black">{likes}</p>
        </div>
        <div className="flex gap-3">
          <FaRegStar
            color="black"
            size={20}
            className="cursor-pointer hover:animate-pulse"
          />
          <p className="font-bold text-black">0</p>
        </div>
        <div className="flex gap-3">
          <FaRegComment
            onClick={() => {
              setComment(!comment);
            }}
            color="black"
            size={20}
            className="cursor-pointer hover:animate-pulse"
          />
          <p className="font-bold text-black">{info?.comments.length}</p>
        </div>
      </div>
      {comment && (
        <ComentariesBox
          comments={info?.comments}
          pubId={info._id.toString()}
        />
      )}
    </article>
  );
}
