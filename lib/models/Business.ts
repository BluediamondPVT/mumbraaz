import mongoose, { Schema, Document, models } from "mongoose";

export interface IBusiness extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId; // User (Vendor) ka ID
  contact: {
    phone: string;
    whatsapp: string;
    website?: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
  };
  media: {
    thumbnail: string;
    gallery: string[];
    videoUrl?: string;
  };
  features: string[]; // e.g. ["AC", "Parking", "WiFi"]
  menuImages: string[];
  averageRating: number;
  totalReviews: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User" },
    
    contact: {
      phone: { type: String, required: true },
      whatsapp: { type: String, required: true },
      website: { type: String },
    },
    
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    
    media: {
      thumbnail: { type: String, required: true },
      gallery: [{ type: String }],
      videoUrl: { type: String },
    },
    
    features: [{ type: String }],
    menuImages: [{ type: String }],
    
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export const Business = models.Business || mongoose.model<IBusiness>("Business", BusinessSchema);