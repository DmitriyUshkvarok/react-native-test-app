import { Id } from '@/convex/_generated/dataModel';

export interface PostUser {
  _id: Id<'users'>;
  name: string;
  fullName: string;
  image: string | undefined;
}

export interface Post {
  _id: Id<'posts'>;
  userId: Id<'users'>;
  imageUrl: string;
  caption?: string;
  user: PostUser | null;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  _creationTime: number;
}
