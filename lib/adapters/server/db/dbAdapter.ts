import { Avatar } from '@/lib/types/avatar';
import { Publication } from '@/lib/types/publication';
//PARAMETERS TYPES
export type AvatarUsernameAndPubsPerDay = { image: string, name: string, pubcountperday: number };
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
	//POSTS
	like(pubId: string, email: string): Promise<void>;
	getUserAvatarUsernameAndPubsPerDay(email: string): Promise<AvatarUsernameAndPubsPerDay>;
	pushComment(comment: Comment): Promise<void>;
	substractOnePubsPerDay(email: string): Promise<void>;
	postPub(pub: Pub): Promise<void>;
	deletePub(pubId: string, author: string): Promise<void>;
	addFavourite(pubId: string, username: string): Promise<void>;
	delFavourite(pubId: string, username: string): Promise<void>;
	createUser(name: string, image: string, email: string): Promise<void>;
	//GETTS
	getAvatars(limit: number): Promise<Avatar[]>;
	getPubs(params: GetPubs): Promise<string>;
	getPub(id: string): Promise<Publication>;
	getExtras(amount: number): Promise<Record<string, string>[]>;
	getFavourites(username: string): Promise<Publication[]>;
}