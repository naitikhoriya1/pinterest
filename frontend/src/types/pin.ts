export interface PinOwner {
  _id: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface Pin {
  _id: string;
  owner: string;
  title: string;
  description?: string;
  imageUrl: string;
  width: number;
  height: number;
  tags: string[];
  saveCount: number;
  cloudinaryId?: string;
  createdAt: string;
}
