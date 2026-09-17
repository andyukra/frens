'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa6";

export default function BackButton() {

	const router = useRouter();

  return (
	<button
		className="inline-flex items-center gap-2 rounded-lg p-2 bg-gray-200 text-black hover:bg-white transition"
		onClick={() => router.back()}
	>
		<FaArrowLeft size={20} color="black"/>
		<span className="font-medium">Volver</span>
	</button>
  )
}
