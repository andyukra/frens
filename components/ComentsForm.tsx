"use client";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa6";
import { useState, useActionState, useEffect, useRef, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { Turnstile } from "nextjs-turnstile";
import { upComment } from "@/app/actions/serverActions";
import { ResponseComment } from '@/lib/types/response';

//TYPES
type Props = {
  pubId: string;
  cb: (txt: string) => void;
};
type TypeComment = "TEXT" | "IMG";
//INIT
let initState: ResponseComment = {};
//MAIN FC
export default function ComentsForm({ pubId, cb }: Props) {
  //HOOKS
  const { status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(upComment, initState);
  const onMount = useRef(true);
  const formRef = useRef(null);
  //COMPONENT ON MOUNT
  useEffect(() => {
    if(onMount.current === true) {
      onMount.current = false;
      return;
    }
    if(state?.message) {
      cb(state.message);
    }
  }, [state]);
  //HANDLERS
  function handleOnChangeImage(e: ChangeEvent<HTMLInputElement>) {
    if(!token) return;
    if(isPending) return;
    if (e.target.files && e.target.files.length > 0) {
      formRef.current.requestSubmit();
    }
  }
  //RENDER
  return (
    <>
      {status == "authenticated" && (
        <form
          ref={formRef}
          action={formAction}
          className="w-full flex gap-4 items-center pt-2"
        >
          {!token ? (
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setToken}
              onError={() => console.error("Error en Turnstile")}
              onExpire={() => setToken(null)}
            />
          ) : (
            <>
              {token && <input type="text" defaultValue={token} hidden name="token" />}
              <input type="text" defaultValue={pubId} hidden name="id" />
              <div className="commentBX w-full flex justify-between items-center gap-3">
                <input
                  type="text"
                  placeholder="Escribe un comentario"
                  name="comment"
                  maxLength={500}
                  minLength={1}
                  className={`bg-white w-full py-2 px-4 rounded-lg focus:outline-none text-black`}
                  disabled={!token}
                />
                <input
                  disabled={!token}
                  type="file"
                  name="image"
                  id={pubId}
                  hidden
                  accept="image/*"
                  onChange={handleOnChangeImage}
                />
              </div>

              {isPending ? (
                <FaSpinner className="animate-spin text-white" size={20} />
              ) : (
                <>
                <label htmlFor={pubId} className="">
                  <FaImage className="text-white cursor-pointer size-5" />
                </label>
                <button disabled={!token}>
                  <FaPaperPlane
                    size={20}
                    className="cursor-pointer hover:animate-pulse text-white"
                  />
                </button>
                </>
              )}
            </>
          )}
        </form>
      )}
    </>
  );
}
