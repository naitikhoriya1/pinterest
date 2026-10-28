export interface Comment {
  _id: string;
  pin: string;
  author: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}
