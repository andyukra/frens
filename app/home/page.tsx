import { Suspense } from "react";
//COMPONENTS
import Extras from "@/components/Extras";
import ExtrasSkeleton from "@/components/ExtrasSkeleton";
import PubsListSkeleton from "@/components/PubsListSkeleton";
import HomeContent from "@/components/HomeContent";
// Metadata for the page
export const metadata = {
  title: "frens - home",
};
//MAIN PROCESS
export default async function Home({ searchParams }) {
  //RENDER
  return (
    <main className="lg:px-20 px-2">
      <section className="flex md:gap-5 mb-5">
        <div className="flex flex-col gap-5 w-full mt-1" id="pubs">
          <Suspense fallback={<PubsListSkeleton />}>
            <HomeContent searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<ExtrasSkeleton />}>
            <Extras />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
