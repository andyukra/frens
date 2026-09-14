'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa6";

export default function BackButton() {

	const router = useRouter();

  return (
	<button
		className="inline-flex items-center gap-2 rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 hover:text-black"
		onClick={() => router.back()}
	>
		<FaArrowLeft size={20} />
		<span className="font-medium">Volver</span>
	</button>
  )
}
