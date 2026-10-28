import { create } from 'zustand';
import { Comment } from '@/lib/types/comment';
//TYPES
type ImageViewer = {
	url: string,
	alt: string,
	setData: (url: string, alt: string) => void,
	clearData: () => void
}
type CommentsBox = {
	pubId: string,
	comments: Comment[],
	setData: (comments: Comment[], pubId: string) => void,
	clearData: () => void
}
//STORE HOOKS
export const useImageViewer = create<ImageViewer>(set => ({
	url: "",
	alt: "",
	setData: (url, alt) => set({ url, alt }),
	clearData: () => set({ url: "", alt: "" })
}));

export const useCommentsBox = create<CommentsBox>(set => ({
	comments: [],
	pubId: "",
	setData: (comments: Comment[], pubId: string) => set({comments, pubId}),
	clearData: () => set({comments: [], pubId: ""})
}));