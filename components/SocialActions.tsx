"use client";
//MISC
import { useState } from "react";
import { useCommentsBox } from "@/lib/stores/dialogs";
import { Comment } from "@/lib/types/comment";
import { toast } from "react-toastify";
import { addFavourite, delFavourite } from "@/app/actions/serverActions";
import { like } from "@/app/actions/serverActions";
import { useMutation } from '@tanstack/react-query';
//UI
import { FaRegThumbsUp, FaRegStar, FaRegComment } from "react-icons/fa6";

//TYPES
type Data = {
  PubId: string;
  likesCount: number;
  favsCount: number;
  isAuth: boolean;
  comments: Comment[];
  vip: boolean
};
type Props = { data: Data };
//MAIN COMPONENT
export default function SocialActions({
  data: { likesCount, favsCount, isAuth, comments, PubId, vip },
}: Props) {
  // ************** H O O K S ********************
  //MODAL COMMENTS
  const { setData: setComments } = useCommentsBox();
  //LIKES AND FAVOURITES
  const [likes, setLikes] = useState<number>(likesCount);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFavourited, setIsFavourited] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<number>(favsCount);
  const [disabledLikes, setDisabledLikes] = useState<boolean>(false);
  const [disabledFavourites, setDisabledFavourites] = useState<boolean>(false);
  const { mutate: mutateLike } = useMutation({
    mutationFn: async () => {
      const res = await like(PubId);
      if(res.errors) throw new Error(res.errors);
    },
    onMutate: () => {
      setLikes((prev) => prev + 1)
      setIsLiked(true);
    },
    onError: () => {
      setLikes((prev) => prev - 1)
      setIsLiked(false);
    },
    onSettled: () => { setDisabledLikes(true); }
  });
  const { mutate: mutateDelFav } = useMutation({
    mutationFn: async () => delFavourite(PubId),
    onMutate: () => {
      const conf = confirm("Quieres quitar este post de tus favoritos?");
      if(!conf) throw new Error("");
      setFavourites(prev => prev - 1);
    },
    onSuccess: () => {
      toast.success("Favorito eliminado exitosamente");
    }
  });
  const { mutate: mutateAddFav } = useMutation({
    mutationFn: async () => {
      const res = await addFavourite(PubId);
      if(res.errors) throw new Error(res.errors);
    },
    onMutate: () => {
      setFavourites((prev) => prev + 1)
      setIsFavourited(true);
    },
    onError: async err => {
      if(err.message === "exists") {
        mutateDelFav();
      }
      setFavourites((prev) => prev - 1);
      setIsFavourited(false);
    },
    onSuccess: () => { toast.success("Has agregado un nuevo favorito!") },
    onSettled: () => { setDisabledFavourites(true); }
  });
  
  //RENDER
  return (
    <div className="flex items-center justify-around py-3 rounded-b-lg">
      {/*LIKES*/}
      <div className="flex gap-3">
        <FaRegThumbsUp
          onClick={async () => {
            if (!isAuth) return;
            mutateLike();
          }}
          color={isLiked ? "#C62368" : vip ? "#fff" : "#222"}
          size={20}
          className={`cursor-pointer hover:animate-pulse ${
            (!isAuth || disabledLikes) ? "pointer-events-none" : ""
          }`}
        />
        <p
          className={`font-bold ${isLiked ? "text-[var(--secondary)]" : vip ? 'text-white' : 'text-["#222"]'}`}
        >
          {likes}
        </p>
      </div>
      {/*FAVOURITES*/}
      <div className="flex gap-3">
        <FaRegStar
          color={isFavourited ? "#C62368" : vip ? "#fff" : "#222"}
          size={20}
          className={`cursor-pointer hover:animate-pulse ${
            (!isAuth || disabledFavourites) ? "pointer-events-none" : ""
          }`}
          onClick={async () => {
            if(!isAuth) return;
            mutateAddFav();
          }}
        />
        <p className={`font-bold ${isFavourited ? "text-[var(--secondary)]" : vip ? 'text-white' : 'text-["#222"]'}`}>{favourites}</p>
      </div>
      {/*COMMENTS*/}
      <div className="flex gap-3">
        <FaRegComment
          onClick={() => setComments(comments, PubId.toString())}
          color={vip ? "#fff" : "#222"}
          size={20}
          className="cursor-pointer hover:animate-pulse"
        />
        <p className={`font-bold ${vip ? 'text-white' : 'text-[#222]'}`}>{comments.length}</p>
      </div>
    </div>
  );
}
