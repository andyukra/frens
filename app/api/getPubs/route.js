import { db } from '@/lib/db';
import Pubs from '@/lib/models/pubs';
import { NextResponse } from 'next/server';

export async function GET() {
    await db();
    const pubs = await Pubs.find({});
    if(pubs.length == 0) return NextResponse.json({err: 'NO HAY PUBS'}).status(401);
    return NextResponse.json(pubs);
}