import { FaPenToSquare, FaYoutube, FaImage, FaHeadphones } from "react-icons/fa6";
import Link from 'next/link';

export const metadata = {
  title: "frens - dashboard",
};

export default function dashboard() {
  return (
    <main className="md:px-10 px-5 py-5 h-[calc(100dvh-64px-1.25rem)]">
      <div className="grid grid-cols-2 md:gap-4 gap-2 h-full">
        <Link href="/publicate/text" className="ring-2 ring-yellow-100 addPub w-full bg-violet-600 rounded flex justify-center items-center cursor-pointer hover:bg-violet-700">
          <FaPenToSquare size={70} color={"white"} />
        </Link>
        <Link href="/publicate/video" className="ring-2 ring-yellow-100 addPub w-full bg-red-500 rounded flex justify-center items-center cursor-pointer hover:bg-red-700">
          <FaYoutube size={70} color={"white"} />
        </Link>
        <Link href="/publicate/image" className="ring-2 ring-yellow-100 addPub w-full bg-orange-400 rounded flex justify-center items-center cursor-pointer hover:bg-orange-700">
          <FaImage size={70} color={"white"} />
        </Link>
        <Link href="/publicate/audio" className="ring-2 ring-yellow-100 addPub w-full bg-lime-400 rounded flex justify-center items-center cursor-pointer hover:bg-lime-700">
          <FaHeadphones size={70} color={"white"} />
        </Link>
      </div>
    </main>
  );
}
