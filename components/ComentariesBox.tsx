"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
//COMPONENTS
import Comentary from "@/components/Comentary";
import ComentsForm from "@/components/ComentsForm";
//TYPES
import type { Comment } from '@/lib/types/comment';

//TYPES
type Props = {
  comments: Comment[]
  pubId: string
}
//MAIN FC
export default function ComentariesBox({ comments, pubId }:Props) {
  const { data: session } = useSession();

  const [commentaries, setCommentaries] = useState<Comment[]>(
    comments || []
  );

  function addComment(text: string) {
    if(!session || !session.user) return;
    const obj = {
      avatar: session.user.image,
      author: session.user.name,
      date: new Date(),
      msg: text,
    };
    //@ts-ignore
    setCommentaries((prev) => [obj, ...prev]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col max-h-[720px]">
      {/* COMMENTS LIST */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {commentaries.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <h4 className="text-center text-lg font-medium text-yellow-100">
              No hay comentarios
            </h4>
          </div>
        ) : (
          <div className="flex flex-col">
            {[...commentaries].reverse().map((comment, key) => (
              <Comentary
                key={key}
                elem={comment}
              />
            ))}
          </div>
        )}
      </div>

      {/* FORM */}
      <div className="border-t-2 border-yellow-100 p-4">
        <ComentsForm
          pubId={pubId}
          cb={addComment}
        />
      </div>
    </div>
  );
}