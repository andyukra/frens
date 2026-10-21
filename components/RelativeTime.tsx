"use client";

import { useEffect, useState } from "react";
import moment from "moment";
//@ts-ignore
import "moment/locale/es";

moment.locale("es");

export default function RelativeTime({
  date,
}: {
  date: string | Date;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(moment(date).fromNow());
  }, [date]);

  return <p className="text-sm text-yellow-100">{text || ""}</p>;
}