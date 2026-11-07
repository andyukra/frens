import { getFavourites } from "@/lib/dbConsults";
import { Publication } from "@/lib/types/publication";
//UI
import Pub from "@/components/Pub";

export const instant = false;

export default async function Favourites() {
  const { message, errors } = await getFavourites();

  if (errors) return <h1>{errors}</h1>;
  const favourites: Publication[] = JSON.parse(message);

  return (
    <section className="lg:px-20 px-4 mt-5">
      {favourites.length === 0 ? (
        <h1>No tienes favoritos</h1>
      ) : (
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
            {favourites.map((elem, i) => <Pub info={elem} key={i} />)}
        </div>
      )}
    </section>
    )
}
