import PublicateForm from "@/components/PublicateForm";

export function generateStaticParams() {
  return [
    { type: "image" },
    { type: "video" },
    { type: "audio" },
    { type: "text" },
  ];
}

export default async function Publicate({ params }) {
  const { type } = await params;

  return (
    <main className="md:px-10 px-5 py-5 h-[calc(100dvh-64px-1.25rem)] text-black">
      <section className="h-full flex justify-center items-center flex-col gap-5">
        <h1 className="text-3xl font-bold">Publicar</h1>

        <PublicateForm type={type} />
      </section>
    </main>
  );
}