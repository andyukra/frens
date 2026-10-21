import { Suspense } from "react";
import { getUncacheableData, getCacheableData } from "@/lib/dbConsults";
//COMPONENTS
import Extras from "@/components/Extras";
import PubsList from "@/components/PubsList";
import ExtrasSkeleton from "@/components/ExtrasSkeleton";
// Metadata for the page
export const metadata = {
  title: "frens - home",
};
export const instant = false;
//GLOBAL VARS
const docsPerPage = 20;
//MAIN PROCESS
export default async function Home({ searchParams }) {
  const params = await searchParams;
  //EXTRACT AND SANITYZE DATA FROM PARAMS
  const page = Number(params.page ?? 1);
  const author = params.author ?? "all";
  const search = params.search ?? "";
  //SELECT CACHEABLE OR UNCACHEABLE
  const { message, errors } = await (
    (author === 'all' && !search && page < 4) ?
    getCacheableData(page, docsPerPage) :
    getUncacheableData(page, search, author, docsPerPage)
  );
  if(errors) return <h1>Ha ocurrido un error al cargar los datos</h1>;
  const { pubs, count } = JSON.parse(message);
  const initialData = { pubs, count, search, author, page };
  //RENDER
  return (
    <main className="lg:px-20 px-2">
      <section className="flex md:gap-5 mb-5">
        <div className="flex flex-col gap-5 w-full mt-1" id="pubs">
          <PubsList initialdata={initialData} docsPerPage={docsPerPage} />
          <Suspense fallback={<ExtrasSkeleton />}>
            <Extras />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
