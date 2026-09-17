"use client";

import { FaShareNodes } from "react-icons/fa6";
import Toast from "@/components/Toast";
import { useState } from 'react';

//TYPES
type Props = { pubId: string, color: string }
//MAIN FC
export default function Clipboard({ pubId, color = "black" }:Props) {
    //HOOKS
    const [state, setState] = useState(false);
  const url = `https://frens.site/pub/${pubId}`;
  return (
    <>
        {state && (<Toast msg={'Link copiado, lo puede pegar donde quiera'}/>)}
      <FaShareNodes
        color={color}
        size={25}
        className="hover:animate-pulse cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setState(true);
          setTimeout(() => setState(false), 3000);
        }}
      />
    </>
  );
}
