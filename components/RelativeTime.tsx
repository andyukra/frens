"use client";

import { useEffect, useState } from "react";
import moment from "moment";
//@ts-ignore
import "moment/locale/es";

moment.locale("es");

export default function RelativeTime({
  date,
  vip
}: {
  date: string | Date;
  vip: boolean
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(moment(date).fromNow());
  }, [date]);

  return <p className={`text-sm ${vip ? "text-white" : "text-[var(--secondaryTextLight)]"}`}>{text || ""}</p>;
}