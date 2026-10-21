import { getUncacheableData, getCacheableData } from '@/lib/dbConsults';

export async function GET(req) {
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

	if (errors) return new Response(errors).status;

	return new Response(message).ok;

}