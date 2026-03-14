import mongoose, { Schema, models } from "mongoose";

const BannerSchema = new Schema(
  {
    type: { type: String, default: "homepage", unique: true }, // Ek hi document banega
    desktop1: { type: String, required: true },
    desktop2: { type: String, required: true },
    desktop3: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

export const Banner = models.Banner || mongoose.model("Banner", BannerSchema);