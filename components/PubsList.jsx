import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import Pub from "@/components/Pub";
import Pagination from "@/components/Pagination";

async function getData(page, search, author, docsPerPage) {
  const skip = (page - 1) * docsPerPage;
  if (search) {
    const pubs = await Pubs.find({ title: { $regex: search, $options: "i" } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage);
    const count = await Pubs.find({
      title: { $regex: search, $options: "i" },
    }).countDocuments();
    return { pubs, count };
  }
  if (author !== "all" && !search) {
    const pubs = await Pubs.find({ author: author })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage);
    const count = await Pubs.find({ author: author }).countDocuments();
    return { pubs, count };
  }
  const pubs = await Pubs.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(docsPerPage);
  const count = await Pubs.find({}).countDocuments();
  return { pubs, count };
}

export default async function PubsList({ page, author, search, docsPerPage }) {
  await db();
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
