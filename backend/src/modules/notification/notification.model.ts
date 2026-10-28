import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  type: "NEW_PIN";
  actor: Types.ObjectId;
  pin: Types.ObjectId;
  actorName: string;
  actorAvatar?: string;
  pinTitle: string;
  pinImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["NEW_PIN"],
      required: true,
      default: "NEW_PIN",
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pin: {
      type: Schema.Types.ObjectId,
      ref: "Pin",
      required: true,
    },
    actorName: {
      type: String,
      required: true,
    },
    actorAvatar: {
      type: String,
    },
    pinTitle: {
      type: String,
      required: true,
    },
    pinImageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.model<INotification>("Notification", notificationSchema);
