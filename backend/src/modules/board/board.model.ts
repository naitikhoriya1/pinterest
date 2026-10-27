import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBoard extends Document {
  name: string;
  owner: Types.ObjectId;
  isPrivate: boolean;
  pins: Types.ObjectId[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPrivate: { type: Boolean, default: false },
    pins: [{ type: Schema.Types.ObjectId, ref: "Pin" }],
    coverImage: { type: String },
  },
  { timestamps: true }
);

boardSchema.index({ owner: 1 });
boardSchema.index({ name: "text" });

export default mongoose.model<IBoard>("Board", boardSchema);
