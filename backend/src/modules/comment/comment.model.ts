import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  pin: Types.ObjectId;
  author: Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    pin: { type: Schema.Types.ObjectId, ref: "Pin", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, default: "Someone", trim: true },
    authorAvatar: { type: String, default: "" },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Index for listing comments by pin in newest-first cursor order
commentSchema.index({ pin: 1, createdAt: -1, _id: -1 });

export default mongoose.model<IComment>("Comment", commentSchema);
