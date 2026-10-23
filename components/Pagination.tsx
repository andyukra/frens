"use client";
import { useSearchParams } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
//TYPES
type Props = { total: number; docs: number };
//MAIN FC
export default function Pagination({ total, docs }: Props) {
  //HOOKS
  //PARAMS AND VARIABLES
  const params = useSearchParams();
  const current = Number(params.get("page")) || 1;
  const search = params.get("search") || "";
  const author = params.get("author") || "all";
  //RETORN URL PATH
  function urlPath(num: number) {
    if (search) return `/home?page=${num}&search=${search}`;
    if (author !== "all") return `/home?page=${num}&author=${author}`;
    return `/home?page=${num}&author=all`;
  }
  function prev() {
    if (current <= 1) return;
    window.history.pushState({}, "", urlPath(current - 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function next() {
    const totalPages = Math.ceil(total / docs);
    if (current >= totalPages) return;
    window.history.pushState({}, "", urlPath(current + 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  return (
    <div className="flex mb-5 flex-wrap px-2 justify-center items-center">
      <div
        style={{ transition: "0.3s" }}
        className="shadow-md bg-black rounded-l-lg p-5 cursor-pointer"
        onClick={() => prev()}
      >
        <FaAngleLeft />
      </div>
      <div className="bg-black font-bold rounded-md p-5 pointer-events-none border-x-2 border-solid border-white">
        {current}
      </div>
      <div
        style={{ transition: "0.3s" }}
        className="shadow-md bg-black rounded-r-lg p-5 cursor-pointer"
        onClick={() => next()}
      >
        <FaAngleRight />
      </div>
    </div>
  );
}
