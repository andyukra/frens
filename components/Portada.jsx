import { db } from "@/lib/db";
import Daily from "@/lib/models/daily";
import Pubs from "@/lib/models/pubs";
import Pub from "@/components/Pub";
import { Lobster } from "next/font/google";

//config lobster font
const lobster = Lobster({ subsets: ["latin"], weight: ["400"] });

await db();

const { dailyPub } = await Daily.findOne({});
const daily = await Pubs.findById(dailyPub);

export default function Portada() {
  return (
    <section
      className="w-full p-3 flex flex-col justify-center items-center gap-5"
    >
      <h2
        className={`${lobster.className} font-bold text-5xl text-center text-black`}>Portada del día</h2>
      <div className="m-h-[80dvh] overflow-y-auto">
        <Pub data={JSON.stringify(daily)} type="portada"/>
      </div>
    </section>
  );
}
