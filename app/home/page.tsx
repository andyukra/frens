import Extras from "@/components/Extras";
import PubsList from "@/components/PubsList";
import PubsListSkeleton from "@/components/PubsListSkeleton";
import ExtrasSkeleton from "@/components/ExtrasSkeleton";
import { Suspense } from "react";
import { CardCarousel } from "@/components/CoolSlider";

// Metadata for the page
export const metadata = {
  title: "frens - home",
};
//GLOBAL VARS
const docsPerPage = 20;
const images = [
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1789645592/thc6sgmayw6jycecha3o.jpg", alt: "Y3SS marcando límites 🤚", link: "https://frens.site/pub/6aabd31811ced8e3f2638f96" },
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1788827649/yvbvjogotmccf8xkyexg.gif", alt: "🌻 Girasol🌻", link: "https://frens.site/pub/6a9f58028b5544c62604b424" },
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1754935467/z16lavpoomebzw9av1b6.jpg", alt: "Dhafne revelaciones 2.0", link: "https://frens.site/pub/689a30abc181512fc1ebf777" },
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1748397033/h7urokmy3ibmae8krxj5.png", alt: "Galaxy vs desmadres??", link: "https://frens.site/pub/68366beab860885939c0172c" },
  { src: "https://res.cloudinary.com/dwbm8g4o5/image/upload/v1721699694/bsexqhhdqgjwtoxawun4.jpg", alt: "HABRÁ CHISMES DE TODOS LOS CHATS", link: "https://frens.site/pub/669f0d6ec1f3cb29a3b8d695" },
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1744732661/wrguak5m4cakaz1whimf.jpg", alt: "Dj nako ofreciendo trabajo a luli", link: "https://frens.site/pub/67fe81f68821b894462266dd" },
  { src: "https://res.cloudinary.com/dwbm8g4o5/image/upload/v1739910784/uvtth39jyspbmkro3o5n.jpg", alt: "KING OF PAJAS", link: "https://frens.site/pub/67b4ee809b574cb8db227827" },
  { src: "https://res.cloudinary.com/dwbm8g4o5/image/upload/v1740101129/drcupkqk1qsevdvmx5sh.jpg", alt: "Les desea feliz año purrunga", link: "https://frens.site/pub/67b7d60a32723d4cb4cb4fb3" },
  { src: "https://res.cloudinary.com/dwbm8g4o5/image/upload/v1740094383/zbefqnbcavmqtslri4j9.jpg", alt: "Megias, el putito con cicatrices.", link: "https://frens.site/pub/67b7bbb0037bb7bce3da1baa" },
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1742243023/gdbfuhfmx2htbpglcnhz.jpg", alt: "La verdadera Travieza", link: "https://frens.site/pub/67d884cf46746d9cd9574431" },
  { src: "https://res.cloudinary.com/dtloj3d2a/image/upload/v1745412617/ga33noxmekhhbhtznfvy.jpg", alt: "Clau 2025, miss California", link: "https://frens.site/pub/6808e209a9712b26b8859e18" },
];
//MAIN PROCESS
export default async function Home({ searchParams }) {
  return (
    <main className="lg:px-20 px-2">
      <CardCarousel images={images} />
      <section className="flex md:gap-5 mb-5">
        <div className="flex flex-col gap-5 w-full" id="pubs">
          <Suspense fallback={<PubsListSkeleton />}>
            <PubsList searchParams={searchParams} docsPerPage={docsPerPage} />
          </Suspense>
          <Suspense fallback={<ExtrasSkeleton />}>
            <Extras />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
