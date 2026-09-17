import BasicSkeleton from "@/components/BasicSkeleton";

export default function ExtrasSkeleton() {
  return (
    <>
      <section className="overflow-x-hidden md:h-[550px] h-[400px] p-5 shadow-md">
        <div className="flex gap-4 w-full h-full">
          {[...Array(10)].map((_, key) => <BasicSkeleton key={key}/>)}
        </div>
      </section>
    </>
  );
}
