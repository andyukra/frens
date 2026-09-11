import Pub from "@/components/Pub";
import Pagination from "@/components/Pagination";
import { getData } from "@/app/actions/serverActions";

export default async function PubsList({ page, author, search, docsPerPage }) {
  const { pubs, count } = await getData(page, search, author, docsPerPage);
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
		{pubs.map((elem, key) => {
			return <Pub info={JSON.stringify(elem)} key={key} />;
		})}
		</div>
    <Pagination total={count} docs={docsPerPage} />
	</div>
  );
}
