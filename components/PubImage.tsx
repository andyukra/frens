"use client";

import { useImageViewer } from "@/lib/stores/dialogs";

type Props = {
  image: string;
  title: string;
};

export default function PubImage({ image, title }: Props) {
  //HOOKS
  const { setData: setImageData } = useImageViewer();
  return (
    <button
      onClick={() => setImageData(image, title || "Imagen")}
      className="w-full">
      <img
        //@ts-ignore
        style={{ cornerShape: "squircle", borderRadius: "1rem" }}
        src={image}
        alt={title}
        className="max-h-[650px] w-auto mx-auto object-contain ring-2 ring-yellow-100"
      />
    </button>
  );
}
