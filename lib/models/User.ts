import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string; // Clerk ka unique ID yahan aayega
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
  savedBusinesses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
    savedBusinesses: [{ type: Schema.Types.ObjectId, ref: "Business" }],
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>("User", UserSchema);