"use client";

import { Lobster } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa6";
import Searcher from "@/components/Searcher";
import UserOpts from "@/components/UserOpts";

const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdown, setDropdown] = useState(false);
  const [avatar, setAvatar] = useState('');
  const pathname = usePathname();

  useEffect(() => {
      if(!session?.user?.email) return;
      if(localStorage.getItem('avatar')) {
        setAvatar(localStorage.getItem('avatar'));
        return;
      }
      fetch(`/api/getavatar?email=${session?.user?.email}`)
        .then(res => res.text())
        .then(response => {
          localStorage.setItem('avatar', response);
          setAvatar(response);
        })
  }, [session?.user?.email]);

  return (
    <nav
      className="h-[64px] z-[100] flex items-center lg:px-20 px-4 justify-between bg-black shadow-md"
    >     
      <Link href="/home?page=1" className={`${lobster.className} flex items-center gap-4`}>
        <h1 className="text-2xl font-bold text-white text-shadow">frens</h1>
      </Link>
      {pathname === "/home" && <Searcher />}
      {status === 'authenticated' ? (
        <ul className="flex justify-center items-center gap-5">
          <li className="relative flex items-center gap-4">
            {!avatar ? <FaUser /> : (
              <img
                onClick={() => setDropdown(!dropdown)}
                className="rounded-full cursor-pointer shadow w-10 h-10 ring-2 ring-white"
                src={avatar}
                alt="avatar"
              />
            )}
            {dropdown && <UserOpts
              username={session?.user?.name || ''}
              cbClose={() => setDropdown(false)}
              cbSignOut={() => signOut()}
            />}
          </li>
        </ul>
      ) : (
        <button onClick={() => signIn("google")} className="font-bold text-white">
          Log In
        </button>
      )}
    </nav>
  );
}
