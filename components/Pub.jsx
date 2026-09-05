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
  FaDeleteLeft
} from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import YtPlayer from "@/components/YtPlayer";
import { motion } from "framer-motion";
import ComentsForm from "@/components/ComentsForm";
import { like } from "@/app/actions/serverActions";
import Clipboard from "@/components/Clipboard";

moment.locale("es");

//FRAME MOTION FOR COMMENTARIES BOX
const optVars = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
  transition: { duration: 1 },
};

export default function Pub({ data, type }) {
  //HOOKS
  data = JSON.parse(data);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comment, setComment] = useState(false);
  const [opts, setOpts] = useState(false);
  const [delLoader, setDelLoader] = useState(false);
  const [likes, setLikes] = useState(data.likes.length);
  const [likesDissable, setLikesDissable] = useState(false);

  //HELPERS
  //FILTER MSGS TYPE
  function filterMsg(msg) {
    if(/.*\.(jpg|gif|png|jpeg|tiff|heif|bmp|webp)$/i.test(msg)) {
      return (
        <img src={msg} alt="comentario con imagen" className="max max-w-[250px] max-h-[300px] rounded-lg drop-shadow-md"/>
      )
    } else {
      return (
        <p className="font-bold p-3 rounded-lg bg-slate-200 text-black break-word">
          {msg}
        </p>
      )
    }
  }
  //INIT
  async function deletePub(data) {
    if (data.author !== session.user.name) return;
    if (!confirm("Seguro que desea eliminar esto?")) return;
    setDelLoader(true);
    const type = data.image
      ? "image"
      : data.yt
      ? "yt"
      : data.audio
      ? "audio"
      : "text";
    let url = `/api/publicate?type=${type}&id=${data._id}`;
    if (type == "image") url += `&src=${data.image.match(/.{24}$/)[0]}`;
    if (type == "audio") url += `&src=${data.audio.match(/.{24}$/)[0]}`;
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
      style={{ cornerShape: 'squircle', borderRadius: '1rem' }}
      className={`my-4 inline-block w-full shadow-md bg-[#fafafa]`}
    >
      <div className="flex items-center justify-between py-2 pl-2 pr-4 border-b-[1px] border-solid border-slate-300">
        <div className="flex gap-3 items-center">
          <div className="md:w-[50px] md:h-[50px] w-[40px] h-[40px]">
            <img
              src={data.avatar}
              className="rounded-full cursor-pointer md:w-[50px] md:h-[50px] w-[40px] h-[40px]"
              alt="avatar user"
              onClick={() => router.push(`/home?author=${data.author}`)}
            />
          </div>
          <div className="flex flex-col">
            <p className="md:text-xl text-md font-semibold text-slate-800">
              {data.author}
            </p>
            <p className="text-sm md:text-md text-slate-500">{moment(data.date).fromNow()}</p>
          </div>
        </div>
        <div className="relative">
          <motion.ul
            animate={opts ? "visible" : "hidden"}
            initial={{ scale: 0 }}
            variants={optVars}
            className="absolute top-0 z-30 right-0 text-black p-2 w-[170px] rounded-lg shadow-md flex flex-col gap-1 items-center justify-center bg-white origin-top-right"
          >
            <li className="w-full">
              <Link
                href={`/pub?id=${data._id}`}
                className="cursor-pointer hover:bg-slate-100 rounded w-full flex justify-between p-3"
              >
                <p className="font-bold text-md">Visitar</p>
                <FaArrowRightFromBracket color="black" size={20} />
              </Link>
            </li>
            <li className="cursor-pointer hover:bg-slate-100 rounded w-full flex justify-between p-3">
              <p className="font-bold text-md">Copiar link</p>
              <Clipboard pubId={data._id} color="black" />
            </li>
            {data.author === session?.user.name && (
              <li
                onClick={() => deletePub(data)}
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
          </motion.ul>
          <FaEllipsis
            onClick={() => setOpts(!opts)}
            color="black"
            size={25}
            className="cursor-pointer hover:animate-pulse"
          />
        </div>
      </div>
      <div id="body">
        <div
          id="contentTxt"
          className="py-4 px-2"
        >
          <h2 className="font-extrabold text-black text-xl p-2 border-l-[6px] border-solid border-black rounded-lg bg-slate-100">
            {data.title}
          </h2>
          {(data?.description && type !== 'portada') && (
            <p className="mt-4 rounded-lg px-3 font-bold text-slate-500">{data.description}</p>
          )}
        </div>
        {data?.image && (
          <div className="w-full">
            <img
              alt="imagen linda"
              src={data.image}
              className="w-full h-auto"
            />
          </div>
        )}
        {data?.yt && <YtPlayer link={data.yt} />}
        {data?.audio && (
          <audio
            src={data.audio}
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
              const res = await like(status, session?.user?.name, data._id);
              if(res == 'OK') {
                setLikes(likes + 1);
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
          <p className="font-bold text-black">{data?.comments.length}</p>
        </div>
      </div>
      {comment && (
        <motion.div
          initial={{ scale: 0 }}
          variants={optVars}
          animate={comment ? "visible" : "hidden"}
        >
          <div className="px-6 max-h-[720px] overflow-x-hidden overflow-y-auto">
            {data?.comments.length == 0 ? (
              <h4 className="font-bold text-xl text-center py-2 text-black">
                No hay comentarios
              </h4>
            ) : (
              data.comments.reverse().map((elem, key) => {
                return ((
                  <div key={key} className="py-2 my-2 flex flex-col gap-3">
                    <div className="flex gap-4 items-center">
                      <img
                        src={elem.avatar}
                        alt="avatar author"
                        className="rounded-full w-10 h-10 cursor-pointer"
                        onClick={() => router.push(`/home?author=${elem.author}`)}
                      />
                      <div>
                        <p className="text-md font-bold text-black">{elem.author}</p>
                        <p className="text-sm text-black">{moment(elem.date).fromNow()}</p>
                      </div>
                    </div>
                    {filterMsg(elem.msg)}
                  </div>
                ))
              })
            )}
          </div>
          <div className="px-6 pb-4">
            <ComentsForm pubId={data._id} />
          </div>
        </motion.div>
      )}
    </article>
  );
}
