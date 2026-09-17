import { getUncacheableData, getCacheableData } from "@/lib/dbConsults";
//COMPONENTS
import Pub from "@/components/Pub";
import Pagination from "@/components/Pagination";
//TYPES IMPORT
import type { Publication } from '@/lib/types/publication';
//TYPES
type SearchParams = {
  page: number,
  author: string,
  search: string
}
type Props = { searchParams: SearchParams, docsPerPage: number }
//MAIN FC
export default async function PubsList({ searchParams, docsPerPage  }:Props) {
  //RESOLVE PARAMS PROMISE
  const params = await searchParams;
  //EXTRACT AND SANITYZE DATA FROM PARAMS
  const page = Number(params.page ?? 1);
  const author = params.author ?? "all";
  const search = params.search ?? "";
  //GET PUBS
  //SELECT CACHEABLE OR UNCACHEABLE
  const data = await (
    (author === 'all' && !search && page < 4) ?
    getCacheableData(page, docsPerPage) :
    getUncacheableData(page, search, author, docsPerPage)
  );
  const { pubs, count } = JSON.parse(data);
  return (
	<div>
		{search && (
            <h1 className="text-center text-black text-xl lg:text-2xl font-bold">
              {count} resultados encontrados para{" "}
              <span className="text-2xl lg:text-3xl font-bold text-slate-800">
                {search}
              </span>
            </h1>
        )}
		<div className="lg:columns-4 md:columns-2 break-inside-avoid">
		{pubs.map((elem:Publication, key:number) => {
			return <Pub info={elem} key={key} />;
		})}
		</div>
    <Pagination total={count} docs={docsPerPage} />
	</div>
  );
}
