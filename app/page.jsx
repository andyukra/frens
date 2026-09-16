
import Link from 'next/link';
import { Lobster } from 'next/font/google';
import { getAvatars } from "@/lib/dbConsults";
import AvatarsCarrousel from '@/components/AvatarsCarrousel';

const lobster = Lobster({ subsets: ['latin'], weight: ['400'] });

export default async function Index() {
    const avatars = await getAvatars(30);
    return(
        <main>
            <section className='text-black lg:grid lg:grid-cols-2 px-10 pb-[64px] gap-5 items-center h-[calc(100dvh-64px)] flex justify-center'>
                <div className="txt">
                    <h1 className='text-8xl md:text-[10rem]' style={lobster.style}>Frens</h1>
                    <p
                        className='md:text-2xl text-lg font-[600]'
                    >Una sencilla página de noticias, chismes, capturas y muchas mas tonterías del chat, sean todos bienvenidos, espero que puedan disfrutar el contenido que aqui se presenta, no se lo tomen a mal, es solo para divertirse, muchas gracias y a disfrutar!</p>
                    <Link href="/home">
                        <button 
                        className='mt-2 px-5 py-3 pointer font-[600] text-white bg-black'>Visitar</button>
                    </Link>
                    <AvatarsCarrousel avatars={avatars} />
                </div>
                <div className="image hidden lg:block">
                    <img
                        src="/pic.png"
                        alt="pic"
                        priority="true"
                        style={{maskImage: "linear-gradient(black 80%, transparent)"}}
                    />
                </div>
            </section>
        </main>
    );
}