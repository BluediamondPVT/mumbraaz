import mongoose, { Schema, Document, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  iconUrl?: string; // Optional icon/image
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    iconUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Next.js me models bar-bar compile hote hain, isliye `models.Category || ...` use karte hain
export const Category = models.Category || mongoose.model<ICategory>("Category", CategorySchema);