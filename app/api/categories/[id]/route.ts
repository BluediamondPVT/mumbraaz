import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category nahi mila" }, { status: 404 });
    }
    
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Category Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const body = await req.json();
    const { name, slug, iconUrl, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name aur Slug zaruri hain" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slug.toLowerCase(),
        iconUrl,
        isActive,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category nahi mila" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category Updated Successfully", category: updatedCategory }, { status: 200 });
  } catch (error: any) {
    console.error("Category Update Error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Yeh slug pehle se maujood hai" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category nahi mila" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category Deleted Successfully" }, { status: 200 });
  } catch (error) {
    console.error("Category Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
