import Link from "next/link";
import { getExtras } from "@/lib/dbConsults";

export default async () => {
  const { message, errors } = await getExtras();
  if (errors) return;
  // Duplicate images for seamless loop
  const duplicatedImages = [...message, ...message];
  //RENDER
  return (
    <>
      <style>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 20s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>

      <div 
	  	//@ts-ignore
        style={{ cornerShape: "squircle", borderRadius: "1.2rem" }}
		className="w-full flex-col bg-black relative overflow-hidden flex items-center justify-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0" />
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center py-8">
          <div className="scroll-container w-[90%]">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedImages.map((elem, index) => (
                <Link href={`/pub/${elem._id}`} key={index}>
                  <div
                    className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={elem.image}
                      alt={`Gallery image ${(index % message.length) + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20" />
      </div>
    </>
  );
};
