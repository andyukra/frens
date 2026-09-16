import { create } from 'zustand';
//TYPES
type ImageViewer = {
	url: string,
	alt: string,
	setData: (url: string, alt: string) => void,
	clearData: () => void
}
//STORE HOOKS
export const useImageViewer = create<ImageViewer>(set => ({
	url: "",
	alt: "",
	setData: (url, alt) => set({ url, alt }),
	clearData: () => set({ url: "", alt: "" })
}));
