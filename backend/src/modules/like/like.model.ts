import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId;
  pin: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pin: { type: Schema.Types.ObjectId, ref: "Pin", required: true },
  },
  { timestamps: true }
);

// Enforce one like per user per pin at database level
likeSchema.index({ user: 1, pin: 1 }, { unique: true });

// Useful for batch deletion when a pin is deleted
likeSchema.index({ pin: 1 });

export default mongoose.model<ILike>("Like", likeSchema);
