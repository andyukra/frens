"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useState, useEffect } from "react";

export default function BackButton() {
  const router = useRouter();
  const [back, setBack] = useState<boolean>(false);

  useEffect(() => {
    if (window.history.length > 1) {
      setBack(true);
    }
  }, []);

  if (!back) return null;

  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg p-2 bg-white shadow"
      onClick={() => router.back()}
    >
      <FaArrowLeft size={20} color="black" />
      <span className="font-medium">Volver</span>
    </button>
  );
}
