"use client";

import Link from "next/link";
import moment from "moment";
//@ts-ignore
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
import dynamic from "next/dynamic";
import { useImageViewer } from '@/lib/stores/dialogs';
import { Nunito } from "next/font/google";
//COMPONENTS
import YtPlayer from "@/components/YtPlayer";
import { like } from "@/app/actions/serverActions";
import Clipboard from "@/components/Clipboard";
import CardHeader from "@/components/CardHeader";
import BasicSkeleton from "@/components/BasicSkeleton";
//TYPES IMPORT
import type { Publication } from '@/lib/types/publication';
//GLOBAL VARS
moment.locale("es");
const ComentariesBox = dynamic(() => import("@/components/ComentariesBox"), {
  loading: () => <BasicSkeleton />,
});
const nunito = Nunito({ subsets: ["latin"], weight: ["900", "800"] });

//TYPES
type Props = { info: Publication }
//MAIN FC
export default function Pub({ info }:Props) {
  //HOOKS
  const { data: session } = useSession();
  const router = useRouter();
  const [comment, setComment] = useState(false);
  const [opts, setOpts] = useState(false);
  const [delLoader, setDelLoader] = useState(false);
  const [likes, setLikes] = useState(info.likes.length);
  const [likesDissable, setLikesDissable] = useState(false);

  const { setData: setImageData } = useImageViewer();

  async function deletePub(info:Publication) {
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
  function detectImg(txt:string) {
    if (!/^https.+(png|jpg|jpeg|avif|webm|bmp|gif)$/i.test(txt)) {
      return <p className="mt-2 rounded-lg font-bold text-white">{txt}</p>;
    } else {
      return <div className="w-full">
        <img alt="imagen linda" src={txt} className="mt-4 w-full h-auto max-h-[500px]" 
          //@ts-ignore
          style={{cornerShape: "squircle", borderRadius: "1rem"}}
        />
      </div>;
    }
  }
  return (
    <article
      //@ts-ignore
      style={{ cornerShape: "squircle", borderRadius: "1rem" }}
      className={`my-4 inline-block w-full bg-[#000d] backdrop-blur-sm ring-4 ring-yellow-100`}
    >
      <div className="flex items-center justify-between py-2 pl-2 pr-4 border-b-[2px] border-solid border-yellow-100">
        <CardHeader pub={info} pubDate={moment(info.date).fromNow()} />
        {/* ACTIONS */}
        <div className="relative">
          {opts && (
            <ul className="absolute top-0 z-30 right-0 text-black p-2 w-[170px] rounded-lg shadow-md flex flex-col gap-1 items-center justify-center bg-white origin-top-right">
              <li className="w-full">
                <Link
                  href={`/pub/${info._id}`}
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
            color="#fef9c3"
            size={25}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div id="body">
        <div id="contentTxt" className="py-4 px-4">
          <h2
            //@ts-ignore
            style={{cornerShape: 'squircle', borderRadius: '0.5rem'}}
            className={`${nunito.className} font-[900] text-yellow-300 text-xl p-2 bg-[#000] ring-2 ring-yellow-300`}
          >
            {info.title}
          </h2>
          {info?.description && detectImg(info.description)}
        </div>
        {info?.image && (
          <div className="w-full flex">
            <button className="w-full" onClick={() => setImageData(info.image, info.title)}>
              <img
                alt="imagen linda"
                src={info.image}
                className="w-full h-full"
              />
            </button>
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
      {/* SOCIAL ACTIONS */}
      <div className="flex items-center justify-around py-3 rounded-b-lg border-t-[2px] border-solid border-yellow-100">
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
            color="#fef9c3"
            size={20}
            className={`cursor-pointer hover:animate-pulse ${
              likesDissable ? "pointer-events-none" : ""
            }`}
          />
          <p className="font-bold text-yellow-100">{likes}</p>
        </div>
        <div className="flex gap-3">
          <FaRegStar
            color="#fef9c3"
            size={20}
            className="cursor-pointer hover:animate-pulse"
          />
          <p className="font-bold text-yellow-100">0</p>
        </div>
        <div className="flex gap-3">
          <FaRegComment
            onClick={() => {
              setComment(!comment);
            }}
            color="#fef9c3"
            size={20}
            className="cursor-pointer hover:animate-pulse"
          />
          <p className="font-bold text-yellow-100">{info?.comments.length}</p>
        </div>
      </div>
      {comment && (
        <ComentariesBox comments={info.comments} pubId={info._id.toString()} />
      )}
    </article>
  );
}
