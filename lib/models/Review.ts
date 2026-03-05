import mongoose, { Schema, Document, models } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const Review = models.Review || mongoose.model<IReview>("Review", ReviewSchema);