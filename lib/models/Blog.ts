import mongoose, { Schema, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // Rich text editor ya simple text
    category: { type: String, required: true }, // e.g., "Real Estate", "Food"
    thumbnail: { type: String, required: true },
    author: { type: String, default: "MumbraBiZ Team" },
    readTime: { type: String, default: "5 min read" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Blog = models.Blog || mongoose.model("Blog", BlogSchema);