"use client";

import Comentary from "@/components/Comentary";
import ComentsForm from "@/components/ComentsForm";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ComentariesBox({ comments, pubId }) {
  const { data: session } = useSession();

  const [commentaries, setCommentaries] = useState(
    comments || []
  );

  function addComment(text) {
    const obj = {
      avatar: session?.user?.image,
      author: session?.user?.name,
      date: new Date(),
      msg: text,
    };

    setCommentaries((prev) => [obj, ...prev]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col max-h-[720px]">
      {/* COMMENTS LIST */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {commentaries.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <h4 className="text-center text-lg font-medium text-gray-400">
              No hay comentarios
            </h4>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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
      <div className="border-t border-gray-200 p-4">
        <ComentsForm
          pubId={pubId}
          cb={addComment}
        />
      </div>
    </div>
  );
}