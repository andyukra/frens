"use client";

import { FaShareNodes } from "react-icons/fa6";
import { toast } from "react-toastify";
//TYPES
type Props = { pubId: string; color: string };
//MAIN FC
export default function Clipboard({ pubId, color = "black" }: Props) {
  const url = `https://frens.site/pub/${pubId}`;
  return (
    <>
      <FaShareNodes
        color={color}
        size={25}
        className="hover:animate-pulse cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.info("Link copiado al portapapeles");
        }}
      />
    </>
  );
}
