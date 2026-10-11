"use client";

import { useRouter } from "next/navigation";
import {
  FaPowerOff,
  FaAddressCard,
  FaHouse,
} from "react-icons/fa6";

type Props = {
  username: string;
  cbClose: () => void;
  cbSignOut: () => void;
};

export default function UserOpts({ username, cbClose, cbSignOut }: Props) {
  const router = useRouter();
  return (
    <div className="absolute top-[120%] right-0 p-3 bg-slate-100 w-[250px] rounded z-10 shadow-md">
      <ul className="flex flex-col gap-2">
        <li className="px-4 text-slate-950 text-center border-b-2 border-solid border-slate-950">
          <p className="font-bold text-xl hidden md:block pb-2">
            {username}
          </p>
        </li>
        <li
          onClick={() => {
			cbClose();
            router.push("/dashboard");
          }}
          className="flex justify-between items-center rounded bg-slate-100 px-4 py-2 cursor-pointer hover:bg-slate-300"
        >
          <p className="text-black font-bold text-lg">Dashboard</p>
          <FaAddressCard color="black" size={20} />
        </li>
        <li
          onClick={() => {
			cbClose();
            router.push("/home");
          }}
          className="flex justify-between items-center rounded bg-slate-100 px-4 py-2 cursor-pointer hover:bg-slate-300"
        >
          <p className="text-black font-bold text-lg">Home</p>
          <FaHouse color="black" size={20} />
        </li>
        <li
          onClick={() => {
			cbClose();
            cbSignOut();
          }}
          className=" rounded flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-red-300"
        >
          <p className="text-black font-bold text-lg">Log out</p>
          <FaPowerOff color="black" size={20} />
        </li>
      </ul>
    </div>
  );
}
