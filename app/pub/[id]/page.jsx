import { Suspense } from "react";
import moment from "moment";
import "moment/locale/es";

import { getPub } from "@/lib/dbConsults";

import ComentariesBox from "@/components/ComentariesBox";
import YtPlayer from "@/components/YtPlayer";
import CardHeader from "@/components/CardHeader";
import BackButton from "@/components/BackButton";

moment.locale("es");

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

async function Publication({ params }) {
  const { id } = await params;

  if (!id || !/^[a-f\d]{24}$/i.test(id)) {
    return <Empty />;
  }

  const pub = await getPub(id);

  if (pub === "EMPTY") {
    return <Empty />;
  }

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
          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* HEADER */}
            <div className="p-5">
              <CardHeader
                pub={pub}
                pubDate={moment(pub.date).fromNow()}
              />
            </div>

            {/* TITLE */}
            <div className="px-5">
              <h1 className="rounded-xl bg-gray-950 px-5 py-4 text-center text-xl font-bold text-white">
                {pub.title}
              </h1>
            </div>

            {/* MEDIA */}
            <div className="p-5">

              {pub.image && (
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={pub.image}
                    alt={pub.title}
                    className="max-h-[650px] w-full object-contain"
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
              <div className="border-t border-gray-200 px-5 py-5">
                <p className="whitespace-pre-wrap leading-7 text-gray-700">
                  {pub.description}
                </p>
              </div>
            )}

          </article>
        </section>

        {/* COMMENTS */}
        <section className="lg:sticky lg:top-4">
          <article className="flex max-h-[calc(100dvh-2rem)] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <header className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-xl font-bold text-black">
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