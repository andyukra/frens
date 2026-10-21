"use client";
//COMPONENTS
import Pub from "@/components/Pub";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
//TYPES IMPORT
import type { Publication } from "@/lib/types/publication";
//TYPES
type InitialData = {
  pubs: Publication[];
  page: number;
  count: number;
  search?: string;
  author?: string;
};
type Props = { initialdata: InitialData; docsPerPage: number };
//MAIN FC
export default function PubsList({ initialdata, docsPerPage }: Props) {
  const { pubs, count, search, author, page } = initialdata;
  //HANDLERS
  async function queryFn(): Promise<Publication[]> {
    const res = await fetch(`/getPubs?page=${page}&search=${search}&author=${author}`);
    if(!res.ok) return [];
    const response = await res.text();
    return JSON.parse(response);
  }
  //HOOKS
  const { data, isLoading } = useQuery({
    queryKey: ["pubs", page, search, author],
    queryFn: queryFn,
    initialData: pubs,
  });

  return (
    <div>
      {search && (
        <h1
          //@ts-ignore
          style={{ cornerShape: "squircle", borderRadius: "0.8rem" }}
          className="text-center text-white text-xl lg:text-2xl font-bold p-2 bg-[#0058] backdrop-blur-sm ring-1 ring-blue-100 my-2"
        >
          {count} resultados encontrados para{" "}
          <span className="text-2xl lg:text-3xl font-bold text-blue-500">
            {search}
          </span>
        </h1>
      )}
      <div className="lg:columns-4 md:columns-2 mt-2 break-inside-avoid">
        {isLoading ? (
          <h1>Cargando posts...</h1>
        ) : (
          data?.map((elem: Publication, key: number) => {
            return <Pub info={elem} key={key} />;
          })
        )}
      </div>
      <Suspense fallback={<div className="mb-5 h-16" />}>
        <Pagination total={count ?? 1} docs={docsPerPage} />
      </Suspense>
    </div>
  );
}
