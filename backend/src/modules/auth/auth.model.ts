import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  clerkId?: string;
  avatarUrl?: string;
  interests: Map<string, number>; // tag -> weight
  notificationsLastReadAt?: Date;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: "__clerk__" },
    clerkId: { type: String, sparse: true, unique: true },
    avatarUrl: { type: String },
    interests: { type: Map, of: Number, default: {} },
    notificationsLastReadAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
