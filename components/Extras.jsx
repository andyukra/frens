import Link from "next/link";
import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";

export default async function Extras() {
  await db();
  const extras = await Pubs.aggregate([{ $sample: { size: 10 } }]);
  return (
    <>
      <h2 className="text-2xl font-bold text-center tracking-widest p-5 bg-black w-full rounded-lg shadow-md">
        Los mas visitados
      </h2>
      <section className="overflow-x-hidden md:h-[550px] h-[400px] p-5 shadow-md">
        <div
          className="flex gap-4 w-full h-full avatarCarrousel"
        >
          {extras.map((elem, key) => {
            if (elem.image) {
              return (
                <article
                  key={key}
                  className="h-full rounded-xl hover:scale-[1.04] transition-all shadow-xl"
                  style={{ flex: "0 0 300px" }}
                >
                  <Link href={`/pub?id=${elem._id}`}>
                    <img
                      className="h-full w-full rounded-xl object-cover"
                      src={elem.image}
                      alt={elem.title}
                    />
                  </Link>
                </article>
              );
            }
          })}
          {extras.map((elem, key) => {
            if (elem.image) {
              return (
                <article
                  key={key}
                  className="h-full rounded-xl hover:scale-[1.04] transition-all shadow-xl"
                  style={{ flex: "0 0 300px" }}
                >
                  <Link href={`/pub?id=${elem._id}`}>
                    <img
                      className="h-full w-full rounded-xl object-cover"
                      src={elem.image}
                      alt={elem.title}
                    />
                  </Link>
                </article>
              );
            }
          })}
        </div>
      </section>
    </>
  );
}
