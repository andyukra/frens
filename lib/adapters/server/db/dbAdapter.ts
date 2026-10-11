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
//INTERFACE ADAPTER
export interface DbAdapter {
	like(pubId: string, userId: string): Promise<void>;
	getUserAvatarAndPubsPerDay(email: string): Promise<AvatarAndPubsPerDay>;
	pushComment(comment: Comment): Promise<void>;
	substractOnePubsPerDay(email: string): Promise<void>;
	postPub(pub: Pub): Promise<void>;
	deletePub(pubId: string, author: string): Promise<void>;
}