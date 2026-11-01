
import Link from 'next/link';
import { Lobster } from 'next/font/google';
import { getAvatars } from "@/lib/dbConsults";
import AvatarsCarrousel from '@/components/AvatarsCarrousel';

const lobster = Lobster({ subsets: ['latin'], weight: ['400'] });

export default async function Index() {
    const { message } = await getAvatars(30);
    return(
        <main>
            <section className='lg:grid lg:grid-cols-2 px-10 pb-[64px] gap-5 items-center h-[calc(100dvh-64px)] flex justify-center'>
                <div className="txt flex flex-col gap-5">
                    <h1 
                        className='text-8xl md:text-[10rem] brand' style={lobster.style}>Frens</h1>
                    <p
                        //@ts-ignore
                        style={{cornerShape: 'squircle', borderRadius: '1rem'}}
                        className='md:text-2xl text-lg font-[600] text-slate-700'
                    >Una sencilla página de noticias, chismes, capturas y muchas mas tonterías del chat, sean todos bienvenidos, espero que puedan disfrutar el contenido que aqui se presenta, no se lo tomen a mal, es solo para divertirse, muchas gracias y a disfrutar!</p>
                    <Link href="/home">
                        <button
                        //@ts-ignore
                        style={{cornerShape: 'squircle', borderRadius: '0.5rem'}}
                        className='mt-2 px-5 py-3 pointer font-[600] text-white bg-[var(--secondary)] hover:bg-[var(--primary)] transition'>Visitar</button>
                    </Link>
                    <AvatarsCarrousel avatars={message} />
                </div>
                <div className="image hidden lg:block">
                    <img
                        src="/pic.png"
                        alt="pic"
                        style={{maskImage: "linear-gradient(black 80%, transparent)"}}
                    />
                </div>
            </section>
            <img
                className='fixed bottom-0 left-0 w-full z-[-1] h-full object-cover'
                src="/bgWaves.svg" alt="waves"
            />
        </main>
    );
}