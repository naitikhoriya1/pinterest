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
  },
  { timestamps: true }
);

// Index for feed scoring (cursor-based pagination on createdAt)
pinSchema.index({ createdAt: -1 });

// Index for tag-based filtering
pinSchema.index({ tags: 1 });

// Compound index for efficient feed queries
pinSchema.index({ tags: 1, createdAt: -1 });

// Text index for search
pinSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 10, tags: 5, description: 1 } }
);

export default mongoose.model<IPin>("Pin", pinSchema);
