import Extras from "@/components/Extras";
import Portada from "@/components/Portada";
import PubsList from "@/components/PubsList";
import PubsListSkeleton from "@/components/PubsListSkeleton";
import ExtrasSkeleton from "@/components/ExtrasSkeleton";
import { Suspense } from "react";

export const metadata = {
  title: "frens - home",
};

export const dynamic = "force-dynamic";
const docsPerPage = 20;
//INIT
export default async function Home({ searchParams }) {
  //FILTER PARAMS
  function filtroPage() {
    if (
      !searchParams.page ||
      isNaN(parseInt(searchParams.page)) ||
      /^\W*$/.test(searchParams.page)
    )
      return 1;
    return searchParams.page;
  }
  function filtroSearch() {
    if (!searchParams.search || /^\W*$/.test(searchParams.search)) return "";
    return searchParams.search;
  }
  function filtroAuthor() {
    if (!searchParams.author || /^\W*$/.test(searchParams.author)) return "all";
    return searchParams.author;
  }
  //INITIALIZE
  const page = filtroPage();
  const search = filtroSearch();
  const authorPage = filtroAuthor();

  return (
    <main className="lg:px-20 px-2">
      {authorPage !== 'all' ? (
        <>
        <h1 className="text-center text-2xl font-bold my-5 bg-black py-2 shadow-md">{authorPage}</h1>
        </>
      ) : ''}
      <section className="flex md:gap-5 mb-5">
        <div className="flex flex-col gap-5 w-full" id="pubs">
          <div className="w-full">
            <Portada />
          </div>
          <Suspense fallback={<PubsListSkeleton />}>
            <PubsList page={page} author={authorPage} search={search} docsPerPage={docsPerPage}/>
          </Suspense>
          <Suspense fallback={<ExtrasSkeleton />}>
            <Extras />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
