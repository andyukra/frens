import Extras from "@/components/Extras";
import PubsList from "@/components/PubsList";
import PubsListSkeleton from "@/components/PubsListSkeleton";
import ExtrasSkeleton from "@/components/ExtrasSkeleton";
import { Suspense } from "react";

export const metadata = {
  title: "frens - home",
};

const docsPerPage = 20;
//INIT
export default async function Home({ searchParams }) {
  return (
    <main className="lg:px-20 px-2">
      <section className="flex md:gap-5 mb-5">
        <div className="flex flex-col gap-5 w-full" id="pubs">
          <Suspense fallback={<PubsListSkeleton />}>
            <PubsList searchParams={searchParams} docsPerPage={docsPerPage}/>
          </Suspense>
          <Suspense fallback={<ExtrasSkeleton />}>
            <Extras />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
