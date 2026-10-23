import { getUncacheableData, getCacheableData } from "@/lib/dbConsults";
//COMPONENTS
import PubsList from "@/components/PubsList";
//GLOBAL VARS
const docsPerPage = 20;
//TYPES
type Props = { searchParams: any };
//COMPONENT
export default async function HomeContent({ searchParams }: Props) {
  const params = await searchParams;
  //EXTRACT AND SANITYZE DATA FROM PARAMS
  const page = Number(params.page) || 1;
  const author = params.author || "all";
  const search = params.search || "";
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
    <>
      <PubsList initialdata={initialData} docsPerPage={docsPerPage} />
    </>
  )
}
