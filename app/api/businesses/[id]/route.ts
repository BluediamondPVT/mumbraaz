import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";

// 1. GET Single Business (Edit form me data bharne ke liye)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const business = await Business.findById(resolvedParams.id).lean();
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}

// 2. UPDATE Business (Form save karne pe)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const body = await req.json();

    const updatedData = {
      name: body.name,
      description: body.description,
      category: body.categoryId,
      contact: {
        phone: body.phone,
        whatsapp: body.whatsapp,
      },
      location: {
        address: body.address,
        city: body.city,
        state: "Maharashtra",
        pincode: body.pincode,
      },
      media: {
        thumbnail: body.thumbnail,
        gallery: body.gallery || [],
      },
      status: body.status || "approved",
    };

    const business = await Business.findByIdAndUpdate(resolvedParams.id, updatedData, { new: true });
    
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    return NextResponse.json({ message: "Business Updated Successfully", business }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}

// 3. DELETE Business (Trash dabane pe)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const business = await Business.findByIdAndDelete(resolvedParams.id);
    if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
    return NextResponse.json({ message: "Business Deleted Successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete business" }, { status: 500 });
  }
}