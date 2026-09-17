import type { Comment } from '@/lib/types/comment';
import type { Like } from '@/lib/types/like';

export type Publication = {
  audio: string,
  author: string,
  avatar: string,
  comments: Comment[],
  date: Date,
  description: string,
  favourite: any[],
  image: string,
  likes: Like[],
  title: string,
  yt: string,
  _id: string
}