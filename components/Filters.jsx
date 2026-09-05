"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { HiDocumentDuplicate } from "react-icons/hi";

//IF SELECTED CHANGE BACKGROUND
function changeBG(url, name) {
  if (url == name) return '#444';
  return "#fff";
}
function disableClick(url, name) {
  if (url == name) return 'pointer-events-none';
  return '';
}

export default function Filters({ url, users }) {
  const userss = JSON.parse(users);
  //HOOKS
  const [status, setStatus] = useState(false);
  const [mobile, setMobile] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if(window.innerWidth < 720) {
      setMobile(true);
    } else {
      setStatus(true);
    }
  }, []);
  return (
    <>
    <div onClick={() => setStatus(true)} className="md:hidden fixed w-[45px] h-[45px] flex justify-center items-center rounded-full bg-amber-600 shadow-lg cursor-pointer bottom-[35px] right-[25px] z-50">
      <HiDocumentDuplicate size={27}/>
    </div>
    <section
      style={{ transition: '0.3s', zIndex: 101, cornerShape: 'squircle', borderRadius: '1rem' }}
      className={`text-black md:h-[85dvh] h-[100dvh] top-0 w-full md:sticky md:top-[90px] fixed backdrop-blur-md shadow-lg ${status ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} flex flex-col items-center gap-5 p-3`}
    >
      <div className="w-full flex items-center">
        <h1 className="font-bold text-xl text-center translate-x-3 md:translate-x-0" style={{flex: 2}}>Páginas</h1>
        <FaTimes style={{zIndex: 102}} onClick={() => setStatus(false)} size={20} className="md:hidden"/>
      </div>
      <article className="w-full">
        <fieldset className="w-full flex flex-col gap-5 justify-center items-center">
          <div className="flex flex-col gap-5 items-center overflow-auto md:h-[72dvh] h-[89dvh] w-full px-3 py-1">
          <div
                onClick={() => {
                  router.push(`/home`);
                  if(mobile) setStatus(false);
                }}
                style={{
                  background: changeBG(url, undefined),
                  transition: "0.4s",
                }}
                className="p-5 rounded-lg shadow-md w-full cursor-pointer hover:scale-105"
              >
                <p className="font-bold text-md md:text-end text-center">
                  TODOS
                </p>
              </div>
            {userss.map((item, key) => (
              <div
                onClick={() => {
                  router.push(`/home?author=${item.name}`);
                  if(mobile) setStatus(false);
                }}
                style={{
                  background: changeBG(url, item.name),
                  transition: "0.4s",
                }}
                key={key}
                className={`flex md:flex-row flex-col items-center justify-between p-5 rounded-lg shadow-md w-full cursor-pointer hover:scale-105 ${disableClick(url, item.name)}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-full w-[50px] h-[50px] ring-"
                />
                <p className="font-bold text-md md:text-end text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </fieldset>
      </article>
    </section>
    </>
  );
}
