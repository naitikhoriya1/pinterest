import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPin extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  tags: string[];
  saveCount: number;
  cloudinaryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pinSchema = new Schema<IPin>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    saveCount: { type: Number, default: 0 },
    cloudinaryId: { type: String, default: "" },
  },
  { timestamps: true }
);

// Feed: cursor-based pagination over ALL pins (createdAt + _id tiebreaker)
pinSchema.index({ createdAt: -1, _id: -1 });

// Tag-based filtering (dormant for now, useful for a future "For you" feed)
pinSchema.index({ tags: 1 });
pinSchema.index({ tags: 1, createdAt: -1 });

// Text index for search
pinSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 10, tags: 5, description: 1 } }
);

export default mongoose.model<IPin>("Pin", pinSchema);