import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Banner } from "@/lib/models/Banner";

export async function GET() {
  try {
    await connectToDatabase();
    const banner = await Banner.findOne({ type: "homepage" });
    return NextResponse.json(banner || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Check karo agar pehle se banner hai toh usko update karo, warna naya banao
    const banner = await Banner.findOneAndUpdate(
      { type: "homepage" },
      {
        desktop1: body.desktop1,
        desktop2: body.desktop2,
        desktop3: body.desktop3,
        mobile: body.mobile,
      },
      { new: true, upsert: true } // upsert true matlab agar nahi hai toh create kar dega
    );

    return NextResponse.json({ message: "Banners updated successfully", banner }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update banners" }, { status: 500 });
  }
}