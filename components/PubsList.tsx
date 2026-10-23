"use client";
//COMPONENTS
import Pub from "@/components/Pub";
import Pagination from "@/components/Pagination";
import PubsListSkeleton from "@/components/PubsListSkeleton";
//MISC
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Publication } from "@/lib/types/publication";
import { useSearchParams } from "next/navigation";
//TYPES
type InitialData = {
  pubs: Publication[];
  page: number;
  count: number;
  search: string;
  author: string;
};
type Props = { initialdata: InitialData; docsPerPage: number };
type Data = { pubs: Publication[]; count: number };
//QUERYS
async function queryFn(
  page: number,
  search: string,
  author: string,
): Promise<Data> {
  const res = await fetch(
    `/api/getPubs?page=${page}&search=${search}&author=${author}`,
  );
  if (!res.ok) throw new Error("Falló la obtención de publicaciones");
  const { message } = await res.json();
  return JSON.parse(message);
}
//MAIN FC
export default function PubsList({ initialdata, docsPerPage }: Props) {
  //PARAMS
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || initialdata.page;
  const search = searchParams.get("search") || initialdata.search;
  const author = searchParams.get("author") || initialdata.author;
  //TANSTACK QUERY
  const { data, isPending, error } = useQuery<Data>({
    queryKey: ["pubs", page, search, author],
    queryFn: () => queryFn(page, search, author),
    initialData:
      page === initialdata.page &&
      search === initialdata.search &&
      author === initialdata.author
        ? { pubs: initialdata.pubs, count: initialdata.count }
        : undefined,
  });

  return (
    <div>
      {search && (
        <h1
          //@ts-ignore
          style={{ cornerShape: "squircle", borderRadius: "0.8rem" }}
          className="text-center text-white text-xl lg:text-2xl font-bold p-2 bg-[#0058] backdrop-blur-sm ring-1 ring-blue-100 my-2"
        >
          {initialdata.count} resultados encontrados para{" "}
          <span className="text-2xl lg:text-3xl font-bold text-blue-500">
            {search}
          </span>
        </h1>
      )}
      <div
        className={`${isPending ? "" : "lg:columns-4 md:columns-2"} mt-2 break-inside-avoid w-full`}
      >
        {isPending ? (
          <PubsListSkeleton />
        ) : error ? (
          <h1>{error.message}</h1>
        ) : Array.isArray(data.pubs) ? (
          data.pubs?.map((elem: Publication, key: number) => {
            return <Pub info={elem} key={key} />;
          })
        ) : (
          <h1>No hay publicaciones</h1>
        )}
      </div>
      <Suspense fallback={<div className="mb-5 h-16" />}>
        <Pagination
          total={data?.count || initialdata.count || 1}
          docs={docsPerPage}
        />
      </Suspense>
    </div>
  );
}
