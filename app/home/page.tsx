import { Suspense } from "react";
//COMPONENTS
import InfiniteSlider from '@/components/InfiniteSlider';
import PubsListSkeleton from "@/components/PubsListSkeleton";
import HomeContent from "@/components/HomeContent";
import CommentsSlider from "@/components/CommentsSlider";
// Metadata for the page
export const metadata = {
  title: "frens - home",
};
//MAIN PROCESS
export default async function Home({ searchParams }) {
  //RENDER
  return (
    <main className="lg:px-20 px-2">
      <CommentsSlider />
      <section className="flex md:gap-5 mb-5">
        <div className="flex flex-col gap-5 w-full mt-1" id="pubs">
          <Suspense fallback={<PubsListSkeleton />}>
            <HomeContent searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<h1>Cargando extras...</h1>}>
            <InfiniteSlider />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
