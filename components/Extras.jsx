import Link from "next/link";
import { getExtras } from "@/lib/dbConsults";

export default async function Extras() {
  const extras = await getExtras(10);
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
                  className="h-full hover:scale-[1.04] transition-all"
                  style={{ flex: "0 0 300px", cornerShape: "squircle", borderRadius: "1.5rem", border: "0.5rem solid black" }}
                >
                  <Link href={`/pub?id=${elem._id}`}>
                    <img
                      className="h-full w-full object-cover"
                      src={elem.image}
                      alt={elem.title}
                      style={{cornerShape: "squircle", borderRadius: "1.5rem"}}
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
                  className="h-full rounded-xl hover:scale-[1.04] transition-all"
                  style={{ flex: "0 0 300px", cornerShape: "squircle", borderRadius: "1.5rem", border: "0.5rem solid black" }}
                >
                  <Link href={`/pub?id=${elem._id}`}>
                    <img
                      className="h-full w-full object-cover"
                      src={elem.image}
                      alt={elem.title}
                      style={{cornerShape: "squircle", borderRadius: "1.5rem"}}
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
