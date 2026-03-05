import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";

export async function GET() {
  try {
    await connectToDatabase();
    const businesses = await Business.find({}).populate('category').sort({ createdAt: -1 }).lean();
    return NextResponse.json(businesses, { status: 200 });
  } catch (error) {
    console.error("Businesses Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Name se automatically slug bana lenge
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    // Database mein save karna
    const newBusiness = await Business.create({
      name: body.name,
      slug: slug,
      description: body.description,
      category: body.categoryId,
      contact: {
        phone: body.phone,
        whatsapp: body.whatsapp,
      },
      location: {
        address: body.address,
        city: body.city,
        state: "Maharashtra", // Abhi default rakh dete hain
        pincode: body.pincode,
      },
      media: {
        // Dummy image ki jagah ab frontend se aayi hui Cloudinary image aayegi!
        thumbnail: body.thumbnail, 
      },
      status: "approved", // Kyunki admin add kar raha hai toh direct live ho jayegi
    });

    return NextResponse.json({ message: "Business Added Successfully", business: newBusiness }, { status: 201 });
  } catch (error: any) {
    console.error("Business Error:", error);
    if (error.code === 11000) return NextResponse.json({ error: "Yeh business (slug) pehle se hai" }, { status: 400 });
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}