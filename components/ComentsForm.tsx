"use client";
import { FaPaperPlane, FaSpinner, FaImage } from "react-icons/fa6";
import {
  useState,
  useActionState,
  useEffect,
  useRef,
  ChangeEvent,
  useTransition,
} from "react";
import { useSession } from "next-auth/react";
import { Turnstile } from "nextjs-turnstile";
import { upComment } from "@/app/actions/serverActions";
import { ResponseComment } from "@/lib/types/response";
import { toast } from 'react-toastify';
import S3factory from '@/lib/adapters/client/S3factoryClient';
//TYPES
type Props = {
  pubId: string;
  cb: (txt: string) => void;
};
//INIT
let initState: ResponseComment = {};
//MAIN FC
export default function ComentsForm({ pubId, cb }: Props) {
  //HOOKS
  const { status } = useSession();
  const [isUploadingS3, setIsUploadingS3] =
    useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, formAction, isPending] = useActionState(upComment, initState);
  const [isPendingTransition, startTransition] = useTransition();
  const tokenRef = useRef<string>("");
  const [token, setToken] = useState<string>(tokenRef.current);
  const onMount = useRef<boolean>(true);
  //USEFFECT FOR STATE CHANGE
  useEffect(() => {
    if (onMount.current === true) {
      onMount.current = false;
      return;
    }
    if (state?.message) {
      cb(state.message);
      toast.success("Comentario publicado!");
    }
  }, [state]);
  //HANDLERS
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    if (isPending) return;
    //PREPARE FORMDATA
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.append("token", token);
    console.log("file: ", file);
    //INIT PROCESS
    try {
      if (file) {
        setIsUploadingS3(true);
        const adapter = S3factory(process.env.NEXT_PUBLIC_S3_PROVIDER);
        const secureUrl = await adapter.Upload(file);
        formData.set("image", secureUrl);
        formData.set("comment", "");
      }
      //INVOKE useActionState action with formData
      startTransition(() => formAction(formData));
      //clear file state
      setFile(null);
      formElement.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingS3(false);
    }
  }
  const isLoading = isPending || isPendingTransition || isUploadingS3;
  //RENDER
  return (
    <>
      {status == "authenticated" && (
        <form
          onSubmit={handleSubmit}
          className="w-full flex gap-4 items-center pt-2"
        >
          {!token ? (
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(tok) => {
                tokenRef.current = tok;
                setToken(tok);
              }}
              onError={() => console.error("Error en Turnstile")}
              onExpire={() => {
                tokenRef.current = "";
                setToken("");
              }}
            />
          ) : (
            <>
              <input type="text" defaultValue={pubId} hidden name="id" />
              <div className="commentBX w-full flex justify-between items-center gap-3">
                <input
                  type="text"
                  placeholder="Escribe un comentario"
                  name="comment"
                  maxLength={500}
                  minLength={1}
                  className={`bg-white w-full py-2 px-4 rounded-lg focus:outline-none text-black`}
                  disabled={!token || !!file}
                />
                <input
                  disabled={!token}
                  type="file"
                  id={pubId}
                  hidden
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                />
              </div>

              {isLoading ? (
                <FaSpinner className="animate-spin text-white" size={20} />
              ) : (
                <>
                  <label htmlFor={pubId} className="">
                    <FaImage
                      className={`${!!file ? "text-orange-600 animate-bounce" : "text-white"} cursor-pointer size-5`}
                    />
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
