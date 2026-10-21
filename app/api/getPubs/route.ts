import { getUncacheableData, getCacheableData } from '@/lib/dbConsults';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const page: number = Number(searchParams.get('page')) ?? 1;
	const search: string = searchParams.get('search') ?? "";
	const author: string = searchParams.get('author') ?? "all";
	const docsPerPage: number = 20;
	
	const { message, errors } = await (
		(author === 'all' && !search && page < 4) ?
		getCacheableData(page, docsPerPage) :
		getUncacheableData(page, search, author, docsPerPage)
	);

	if (errors) return NextResponse.json({errors}, {status: 404});

	return NextResponse.json({message}, {status: 200});

}