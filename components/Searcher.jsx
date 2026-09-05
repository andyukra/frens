"use client";

import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Searcher() {
  const router = useRouter();
  const [pattern, setPattern] = useState("");

  function search(e) {
    e.preventDefault();
    router.push(`/home?search=${pattern.trim()}`);
  }

  return (
    <form
      onSubmit={search}
      className="relative flex items-center justify-center"
    >
      <input
        className="md:py-2 px-4 py-1 rounded-full md:w-[35vw] w-[50vw] bg-black placeholder-white border-2 border-solid border-white focus:outline-none"
        type="search"
        placeholder="Buscar..."
        minLength="3"
        maxLength="25"
        required
        pattern="^\w*$"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
      />
      <button className="absolute right-5 cursor-pointer">
        <FaSearch
          color="#fff"
          size={15}
        />
      </button>
    </form>
  );
}
