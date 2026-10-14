import { Avatar } from '@/lib/types/avatar';
import { Publication } from '@/lib/types/publication';
//PARAMETERS TYPES
export type AvatarAndPubsPerDay = { image: string, pubcountperday: number };
export type Pub = {
	author: string,
	avatar: string,
	title: string,
	description?: string,
	image?: string,
	yt?: string,
	audio?: string
}
export type Comment = {
	pubId: string,
	author: string,
	avatar: string,
	content: string
}
export type GetPubs = {
	search?: string,
	author?: string,
	docsPerPage: number,
	skip: number
}
//INTERFACE ADAPTER
export interface DbAdapter {
	like(pubId: string, userId: string): Promise<void>;
	getUserAvatarAndPubsPerDay(email: string): Promise<AvatarAndPubsPerDay>;
	pushComment(comment: Comment): Promise<void>;
	substractOnePubsPerDay(email: string): Promise<void>;
	postPub(pub: Pub): Promise<void>;
	deletePub(pubId: string, author: string): Promise<void>;
	getAvatars(limit: number): Promise<Avatar[]>;
	getPubs(params: GetPubs): Promise<string>;
	getPub(id: string): Promise<Publication>;
	getExtras(amount: number): Promise<any>;
}