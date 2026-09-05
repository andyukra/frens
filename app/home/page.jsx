import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import Users from "@/lib/models/users.js";
import Pub from "@/components/Pub";
import Pagination from "@/components/Pagination";
import Extras from "@/components/Extras";
import Filters from "@/components/Filters";
import Portada from "@/components/Portada";
import Portrait from "@/components/Portrait";

export const metadata = {
  title: "frens - home",
};

export const dynamic = "force-dynamic";

await db();
const users = await Users.find({});

const docsPerPage = 20;
async function getData(page, search, author) {
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
  if(author !== "all" && !search) {
    const pubs = await Pubs.find({ author: author })
      .sort({ date: -1 })
      .skip(skip)
      .limit(docsPerPage);
    const count = await Pubs.find({author: author}).countDocuments();
    return { pubs, count };
  }
  const pubs = await Pubs.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(docsPerPage);
  const count = await Pubs.find({}).countDocuments();
  return { pubs, count };
}
//GET EXTRAS
async function extrasPublications() {
  return await Pubs.aggregate([{ $sample: { size: 10 } }]);
}

//GET USER
function getUser(author) {
  const x = users.filter(x => x.name === author);
  if(!x || x.length == 0) return;
  return x[0];
}

//INIT
export default async function Home({ searchParams }) {
  //RENDER EXTRAS TO PUB LIST
  async function extraPubs() {
    const extrasPubs = await extrasPublications();
    return <Extras extras={JSON.stringify(extrasPubs)} />
  }
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
  const { pubs, count } = await getData(page, search, authorPage);
  // const x = renderPubs();

  return (
    <main className="px-2">
      {authorPage !== 'all' ? (
        <>
        <h1 className="text-center text-2xl font-bold my-5 bg-black py-2 shadow-md">{authorPage}</h1>
        <Portrait portrait={getUser(authorPage)?.portrait} avatar={getUser(authorPage)?.image} author={authorPage}/>
        </>
      ) : ''}
      <section className="flex md:gap-5 mb-5">
        <div id="filters" className="md:w-3/12 w-12/12">
          <Filters url={searchParams.author} users={JSON.stringify(users)}/>
        </div>
        <div className="flex flex-col gap-5 md:w-9/12 w-full" id="pubs">
          <div className="w-full">
            <Portada />
          </div>
          {search && (
            <h1 className="text-center text-black text-xl lg:text-2xl font-bold">
              {count} resultados encontrados para{" "}
              <span className="text-2xl lg:text-3xl font-bold text-slate-800">
                {search}
              </span>
            </h1>
          )}
          <div className="lg:columns-3 md:columns-2 break-inside-avoid">
            {pubs.map((elem, key) => {
              return <Pub data={JSON.stringify(elem)} key={key} />
            })}
          </div>
          {extraPubs()}
        </div>
      </section>
      <Pagination total={count} docs={docsPerPage} />
    </main>
  );
}
