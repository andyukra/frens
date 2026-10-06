"use client";

import { FaImage, FaSpinner, FaHeadphones, FaYoutube } from "react-icons/fa6";
import { useState, useActionState, ChangeEvent, useEffect, useTransition } from "react";
import { publicate } from '@/app/actions/serverActions';
import { useRouter } from "next/navigation";
import { ResponsePub } from '@/lib/types/response';
import { upToCloudinary } from '@/lib/helpers/allHelpers';
//TYPES
type PubType = "image" | "video" | "audio" | "text";
type Props = { type: PubType }
//INIT
const MAX_FILE_SIZE = 15 * 1024 * 1024;
let initState: ResponsePub = {};
//MAIN FC
export default function PublicateForm({ type }:Props) {
  //HOOKS
  const [imgSrc, setImgSrc] = useState(null);
  const [state, formAction, isPending] = useActionState(publicate, initState);
  const [isTransition, startTransition] = useTransition();
  const [isCloudinaryUpload, setIsCloudinaryUpload] = useState<boolean>(false);
  const [file, setFile] = useState<File|null>(null);
  const router = useRouter();
  useEffect(() => {
    if(state.message === "OK") {
      router.push("/home");
      initState = {};
    }
  }, [state]);
  //FUNCTIONS HANDLERS
  function previewImg(img: File) {
    const reader = new FileReader();
    reader.onload = (e) => setImgSrc(e.target.result);
    reader.readAsDataURL(img);
  }
  function handleChangeImage(e: ChangeEvent<HTMLInputElement>) {
    //PREVIEW
    const img = e.target.files[0] ?? null;
    if(!img) throw new Error('Ninguna imágen seleccionada');
    previewImg(img);
    //VERIFY AND SETFILE
    if(img.size > MAX_FILE_SIZE) throw new Error('El archivo supera el límite de 15 MB');
    setFile(img);
  }
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    //INIT formData with FormElement
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    try {
      if(file) {
        setIsCloudinaryUpload(true);
        const secureUrl = await upToCloudinary(file);
        formData.set(type, secureUrl);
        //SUBMIT formAction with FormData
        startTransition(() => formAction(formData));
        //CLEAR FORM FIELDS AND STATE
        setFile(null);
      } else {
        //SUBMIT formAction with FormData
        startTransition(() => formAction(formData));
      }
    } catch(e) {
      console.log(e)
    } finally {
      setIsCloudinaryUpload(false);
    }
  }
  const isLoading = isPending || isCloudinaryUpload || isTransition;
  //RENDER
  return (
    <form
      onSubmit={handleSubmit}
      //@ts-ignore
      style={{cornerShape: 'squircle', borderRadius: '1rem'}}
      className="p-5 bg-[#000d] backdrop-blur-sm ring-4 text-white ring-yellow-100 flex flex-col justify-center items-center gap-5 md:w-6/12 w-full"
    >
      <input type="text" defaultValue={type} hidden name="type"/>
      <hr />
      {type === "image" && (
        <>
          <input
            type="file"
            id="upImg"
            className="hidden"
            onChange={handleChangeImage}
            accept="image/*"
          />
          <label
            className="cursor-pointer flex flex-col justify-center items-center"
            htmlFor="upImg"
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                className={`max-w-[200px] rounded-lg`}
                alt="preview selected image"
              />
            ) : (
              <FaImage color={"white"} size={100} />
            )}
            <p className="mt-2 font-bold">Elegir imágen (4.5 MB màximo)</p>
          </label>
        </>
      )}
      <input
        required
        maxLength={50}
        minLength={1}
        name="title"
        className={`bg-yellow-100 w-full px-4 py-2 text-slate-950 focus:outline-none`}
        type="text"
        placeholder="Título"
        //@ts-ignore
        style={{cornerShape: 'squircle', borderRadius: '0.5rem'}}
      />
      {type === "video" && (
        <>
          <input
            className="bg-yellow-100 rounded-lg shadow w-full px-4 py-2 text-slate-950 focus:outline-none"
            type="url"
            required
            minLength={1}
            maxLength={250}
            name="yt"
            placeholder="https://youtu.be/....."
          />
          <FaYoutube color={"white"} size={100} />
        </>
      )}
      {type !== "video" && (
        <textarea
          required={type == "text" ? true : false}
          maxLength={500}
          minLength={1}
          //@ts-ignore
          style={{cornerShape: 'squircle', borderRadius: '0.5rem'}}
          className={`bg-yellow-100 resize-none w-full px-4 py-2 text-slate-950 focus:outline-none`}
          rows={3}
          name="description"
          placeholder="Descripción"
        ></textarea>
      )}
      {type === "audio" && (
        <>
          <input
            type="file"
            id="upAudio"
            className="hidden"
            accept="audio/*"
            onChange={e => setFile(e.target.files[0])}
          />
          <label
            className="cursor-pointer flex flex-col justify-center items-center"
            htmlFor="upAudio"
          >
            <FaHeadphones color={"white"} size={100} />
            <p className="mt-2 font-bold">
              Elegir Audio (.mp3 .wav .ogg) (4.5 MB màximo)
            </p>
          </label>
        </>
      )}
      <button
        disabled={isLoading}
        type="submit"
        //@ts-ignore
        style={{cornerShape: 'squircle', borderRadius: '0.5rem'}}
        className={`text-white px-4 py-2 font-bold w-full flex justify-center ring-2 ring-yellow-200 hover:bg-green-800 transition`}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin" color={"white"} size={35} />
        ) : (
          <span className="text-xl font-bold">Publicar</span>
        )}
      </button>
    </form>
  );
}
