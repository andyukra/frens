import React from "react";

type Data = { avatar: string , author: string };
type Props = { pub: Data, pubDate: React.ReactNode }

export default function CardHeader({pub, pubDate}) {
  return (
    <div className="flex justify-between items-center text-yellow-100">
      <div className="flex gap-3 items-center">
        <img
          src={pub.avatar}
          alt="author avatar"
          className="rounded-full shadow w-10 h-10"
        />
        <div>
          <h2 className="text-lg font-bold">{pub.author}</h2>
          {pubDate}
        </div>
      </div>
    </div>
  );
}
