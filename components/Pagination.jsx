'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaAngleLeft, FaAngleRight, FaSpinner } from "react-icons/fa6";

export default function Pagination({total, docs}) {
    //HOOKS
    const router = useRouter();
    const [prevLoading, setPrevLoading] = useState(false);
    const [nextLoading, setNextLoading] = useState(false);
    //PARAMS AND VARIABLES
    const page = useSearchParams();
    const current = page.get('page') || 1;
    const search = page.get('search') || '';
    const author = page.get('author') || 'all';
    //RETORN URL PATH
    function urlPath(num) {
        if(search) return `/home?page=${num}&search=${search}`;
        if(author !== 'all') return `/home?page=${num}&author=${author}`
        return `/home?page=${num}&author=all`;
    }
    function prev() {
        if(prevLoading || nextLoading) return;
        if(current <= 1) return;
        setPrevLoading(true);
        router.push(urlPath(parseInt(current)-1));
        setPrevLoading(false);
    }
    function next() {
        if(prevLoading || nextLoading) return;
        const totalPages = Math.ceil(total / docs);
        if(current >= totalPages) return;
        setNextLoading(true);
        router.push(urlPath(parseInt(current)+1));
        setNextLoading(false);
    }
  return (
    <div className="flex mb-5 flex-wrap px-2 justify-center items-center">
        <div style={{transition: '0.3s'}} className='shadow-md bg-black rounded-l-lg p-5 cursor-pointer' onClick={() => prev()}>
            {prevLoading ? <FaSpinner className="animate-spin" /> : <FaAngleLeft />}
        </div>
        <div className='bg-black font-bold rounded-md p-5 pointer-events-none border-x-2 border-solid border-white'>
            {current}
        </div>
        <div style={{transition: '0.3s'}} className='shadow-md bg-black rounded-r-lg p-5 cursor-pointer' onClick={() => next()}>
            {nextLoading ? <FaSpinner className="animate-spin" /> : <FaAngleRight />}
        </div>
    </div>
  )
}
