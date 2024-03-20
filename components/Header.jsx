import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { Lobster } from 'next/font/google';

const lobster = Lobster({ subsets: ['latin'], weight: ['400'] });

export default () => {
    return(
        <header>
            <Navbar/>
            <section className='lg:grid lg:grid-cols-2 px-10 pb-[64px] gap-5 items-center h-[calc(100dvh-64px)] flex justify-center'>
                <div className="txt">
                    <h1 className='text-8xl md:text-[10rem]' style={lobster.style}>Frens</h1>
                    <p
                        className='text-2xl font-[600]'
                    >Una sencilla página de noticias, chismes, capturas y muchas mas tonterías del chat, sean todos bienvenidos, espero que puedan disfrutar el contenido que aqui se presenta, no se lo tomen a mal, es solo para divertirse, muchas gracias y a disfrutar!</p>
                    <Link href="/home">
                        <button className='mt-7 bg-orange-400 px-5 py-3 pointer font-[600]'>Visitar</button>
                    </Link>
                </div>
                <div className="image hidden lg:block">
                    <Image 
                        src="/pic.png"
                        width={1366}
                        height={768}
                        alt="pic"
                        priority
                    />
                </div>
            </section>
        </header>
    );
}