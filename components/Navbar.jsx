"use client";

import { Lobster } from "next/font/google";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { FaPowerOff, FaAddressCard, FaHouse } from "react-icons/fa6";

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();

  return (
    <nav className="h-[80px] flex items-center md:px-10 px-7 justify-between">
      <Link href="/" className={lobster.className}>
        <h1 className="text-2xl font-bold">frens</h1>
      </Link>
      {status === "authenticated" ? (
        <ul className="flex justify-center items-center gap-5">
          <li className="relative flex items-center gap-4">
            <p className="font-bold text-xl hidden md:block">
              {session?.user.name}
            </p>
            <Image
              onClick={() => setDropdown(!dropdown)}
              className="rounded-full cursor-pointer shadow"
              src={session?.user.image}
              width={45}
              height={45}
              alt="avatar"
            />
            <div
              style={{ display: dropdown ? "block" : "none" }}
              className="absolute top-[120%] right-0 p-3 bg-slate-100 w-[250px] rounded"
            >
              <ul className="flex flex-col gap-2">
                <li 
                  onClick={() => {router.push('/dashboard'); setDropdown(false);}}
                  className="flex justify-between items-center rounded bg-slate-100 px-4 py-2 cursor-pointer hover:bg-slate-300">
                    <p className="text-black font-bold text-lg">Dashboard</p>
                    <FaAddressCard color="black" size={20} />
                </li>
                <li 
                  onClick={() => {router.push('/home'); setDropdown(false);}}
                  className="flex justify-between items-center rounded bg-slate-100 px-4 py-2 cursor-pointer hover:bg-slate-300">
                    <p className="text-black font-bold text-lg">Home</p>
                    <FaHouse color="black" size={20} />
                </li>
                <li
                  onClick={() => signOut()}
                  className=" rounded flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-red-300"
                >
                  <p className="text-black font-bold text-lg">Log out</p>
                  <FaPowerOff color="black" size={20} />
                </li>
              </ul>
            </div>
          </li>
        </ul>
      ) : (
        <button onClick={() => signIn("google")} className="font-bold">
          Log In
        </button>
      )}
    </nav>
  );
};