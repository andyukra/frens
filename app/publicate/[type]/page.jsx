"use client";

import { FaImage, FaSpinner, FaHeadphones, FaYoutube } from "react-icons/fa6";
import { useState } from "react";
import { useParams } from "next/navigation";

//PRINCIPAL COMPONENT
export default function Publicate() {


  //HOOKS
  const { type } = useParams();
  const [imgSrc, setImgSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [yt, setYt] = useState("");
  const [audio, setAudio] = useState(null);
  const [loader, setLoader] = useState(false);
  const [overflow, setOverflow] = useState(false);

  //FUNCTIONS HANDLERS
  function previewImg(e) {
    if (type !== "image") return;
    const img = e.target.files[0];
    if (!img) return;
    if(img.size > 4490000) {
      setOverflow(true);
    } else {
      setOverflow(false);
    }
    setFile(img);
    const reader = new FileReader();
    reader.onload = (e) => setImgSrc(e.target.result);
    reader.readAsDataURL(img);
  }

  //SUBMIT FORM
  async function sendForm(e) {
    e.preventDefault();
    if(overflow) return;
    const form = new FormData();
    if (!title) {
      alert("Escriba un titulo porfavor");
      return;
    }
    if(title.length > 50) {
      alert('El título es muy largo');
      return;
    }
    if(description) {
      if(description.length > 500) {
        alert('La descripción es muy larga');
        return;
      }
    }
    form.append("title", title.trim());

    //SWITCH TYPE
    switch (type) {
      //IMAGE
      case "image":
        if (!file) {
          alert("Suba una imagen");
          return;
        }
        form.append("description", description.trim() || "");
        form.append("file", file);
        break;
      //VIDEO
      case "video":
        if (!yt) {
          alert("Pegue un link de youtube porfavor");
          return;
        }
        form.append("yt", yt.trim());
        break;
      //AUDIO
      case "audio":
        if (!audio) {
          alert("Seleccione un archivo de audio porfavor");
          return;
        }
        if(audio.size > 25000000) {
          alert('El archivo es muy pesado');
          return;
        }
        form.append("audio", audio);
        form.append('description', description.trim() || '');
        break;
      //TEXTO
      case "text":
        if (!description) {
          alert("Escriba una descripcion porfavor");
          return;
        }
        form.append('description', description.trim());
        break;
    }

    setLoader(true);
    //SEND FORM
    const res = await fetch(`/api/publicate?type=${type}`, {
      method: "POST",
      body: form,
    });
    const response = await res.json();
    if(response.msg === "PUB LIMITS REACHED") {
      alert('Has alcanzado el máximo de publicaciones al día, espera hasta mañana.');
      location.href = "/home";
      return;
    }
    if (response.msg == "OK") location.href = "/home";
  }


  return (
    <main className="md:px-10 px-5 py-5 h-[calc(100dvh-64px-1.25rem)] text-black">
      <section className="h-full flex justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Publicar</h1>
        <form
          onSubmit={sendForm}
          className="p-5 bg-white flex flex-col justify-center items-center gap-5 md:w-6/12 w-full rounded-lg shadow-lg"
        >
          <hr />
          {type === "image" && (
            <>
              <input
                type="file"
                id="upImg"
                className="hidden"
                onChange={(e) => previewImg(e)}
                accept="image/*"
              />
              <label
                className="cursor-pointer flex flex-col justify-center items-center"
                htmlFor="upImg"
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    className={`max-w-[200px] rounded-lg ${overflow ? 'border-4 border-solid border-red-500' : ''}`}
                    alt="preview selected image"
                  />
                ) : (
                  <FaImage
                    color={"black"}
                    size={100}
                  />
                )}
                <p className="mt-2 font-bold">Elegir imágen (4.5 MB màximo)</p>
              </label>
            </>
          )}
          <input
            required
            maxLength="50"
            minLength="1"
            className={`bg-slate-200 rounded-lg shadow w-full px-4 py-2 text-slate-950 focus:outline-none ${title.length > 50 && 'ring-2 ring-red-600 bg-red-200'}`}
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {type === "video" && (
            <>
              <input
                className="bg-slate-200 rounded-lg shadow w-full px-4 py-2 text-slate-950 focus:outline-none"
                type="url"
                required
                minLength="1"
                maxLength="250"
                placeholder="https://youtu.be/....."
                value={yt}
                onChange={(e) => setYt(e.target.value)}
              />
              <FaYoutube color={"black"} size={100} />
            </>
          )}
          {type !== "video" && (
            <textarea
              required={type == 'text' ? true : false}
              maxLength="500"
              minLength="1"
              className={`bg-slate-200 resize-none rounded-lg shadow w-full px-4 py-2 text-slate-950 focus:outline-none ${description.length > 500 && 'ring-2 ring-red-600 bg-red-200'}`}
              rows="3"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          )}
          {type === "audio" && (
            <>
              <input
                type="file"
                id="upAudio"
                className="hidden"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files[0])}
              />
              <label
                className="cursor-pointer flex flex-col justify-center items-center"
                htmlFor="upAudio"
              >
                <FaHeadphones
                  color={audio ? 'orange' : 'black'}
                  size={100}
                />
                <p className="mt-2 font-bold">Elegir Audio (.mp3 .wav .ogg) (4.5 MB màximo)</p>
              </label>
            </>
          )}
          <button className={`${overflow ? 'pointer-events-none bg-slate-700' : ''} shadow rounded-lg text-white px-4 py-2 font-bold w-full flex justify-center bg-black`}>
            {loader ? (
              <FaSpinner className="animate-spin" color={"black"} size={35} />
            ) : (
              <span className="text-xl font-bold">Publicar</span>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
