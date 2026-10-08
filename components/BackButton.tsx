'use client';

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa6";

export default function BackButton() {

	const router = useRouter();

  return (
	<button
		className="inline-flex items-center gap-2 rounded-lg p-2 ring-2 bg-[#0008] ring-yellow-200 backdrop-blur-sm text-white"
		onClick={() => router.push('/home')}
	>
		<FaArrowLeft size={20} color="white"/>
		<span className="font-medium">Volver</span>
	</button>
  )
}
