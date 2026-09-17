import { Suspense } from "react";
import moment from "moment";
//@ts-ignore
import "moment/locale/es";
import { getPub } from "@/lib/dbConsults";
import { Nunito } from "next/font/google";
//COMPONENTS IMPORT
import ComentariesBox from "@/components/ComentariesBox";
import YtPlayer from "@/components/YtPlayer";
import CardHeader from "@/components/CardHeader";
import BackButton from "@/components/BackButton";
//TYPES
import type { Publication } from '@/lib/types/publication';
//GLOBAL VARS
moment.locale("es");
const nunito = Nunito({ subsets: ["latin"], weight: ["900", "800"] });
//COMPONENTS
function Empty() {
  return (
    <main className="min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center gap-5 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center">
        No se ha encontrado
      </h1>

      <BackButton />
    </main>
  );
}
export default function Pub({ params }) {
  return (
    <Suspense fallback={<h1>Cargando publicación...</h1>}>
      <Publication params={params} />
    </Suspense>
  );
}
//MAIN FC
async function Publication({ params }) {
  const { id } = await params;
  if (!id || !/^[a-f\d]{24}$/i.test(id)) return <Empty />;
  const pub:Publication = await getPub(id);
  if (!pub) return <Empty />;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-8">

      {/* BACK */}
      <div className="py-4">
        <BackButton />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">

        {/* PUBLICATION */}
        <section>
          <article 
            //@ts-ignore
            style={{cornerShape: 'squircle', borderRadius: '2rem'}}
            className="overflow-hidden bg-[#000d] backdrop-blur-sm ring-4 ring-white"
          >

            {/* HEADER */}
            <div className="p-5">
              <CardHeader
                pub={pub}
                pubDate={moment(pub.date).fromNow()}
              />
            </div>

            {/* TITLE */}
            <div className="px-5">
              <h1
                //@ts-ignore
                style={{cornerShape: 'squircle', borderRadius: '0.8rem'}}
                className={`${nunito.className} text-center text-xl font-[900] text-yellow-300 p-2 bg-[#000] ring-2 ring-yellow-300`}
              >
                {pub.title}
              </h1>
            </div>

            {/* MEDIA */}
            <div className="p-5">

              {pub.image && (
                <div className="overflow-hidden rounded-xl p-1">
                  <img
                    //@ts-ignore
                    style={{cornerShape: 'squircle', borderRadius: '1rem'}}
                    src={pub.image}
                    alt={pub.title}
                    className="max-h-[650px] w-auto mx-auto object-contain ring-2 ring-white"
                  />
                </div>
              )}

              {pub.yt && (
                <div className="overflow-hidden rounded-xl">
                  <YtPlayer link={pub.yt} />
                </div>
              )}

              {pub.audio && (
                <div className="rounded-xl bg-gray-100 p-4">
                  <audio
                    className="w-full"
                    src={pub.audio}
                    controls
                  />
                </div>
              )}

            </div>

            {/* DESCRIPTION */}
            {pub.description && (
              <div className="border-t-2 border-white px-5 py-5">
                <p className="whitespace-pre-wrap leading-7 text-white">
                  {pub.description}
                </p>
              </div>
            )}

          </article>
        </section>

        {/* COMMENTS */}
        <section className="lg:sticky lg:top-4">
          <article 
            //@ts-ignore
            style={{cornerShape: 'squircle', borderRadius: '1.5rem'}}
            className="flex max-h-[calc(100dvh-2rem)] min-h-[500px] flex-col overflow-hidden bg-[#000d] backdrop-blur-sm ring-4 ring-white"
          >

            <header className="border-b-2 border-white p-5">
              <h2 className="text-xl font-bold text-white">
                Comentarios
              </h2>
            </header>

            <ComentariesBox
              comments={pub.comments || []}
              pubId={pub._id.toString()}
            />

          </article>
        </section>

      </div>
    </main>
  );
}