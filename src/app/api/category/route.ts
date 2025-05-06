import { NextResponse } from "next/server";
import Category from "../../../models/Category";
import connectDb from "../../lib/database";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: Request): Promise<Response> {
  await connectDb();


  const formData = await request.formData();
  
  const categoryName = formData.get("categoryName") as string | null;
  const file = formData.get("categoryImage") as File | null;

  console.log("File:", file);
  console.log("Category Name:", categoryName);


  if (!categoryName || typeof categoryName !== "string") {
    return NextResponse.json(
      { success: false, message: "Category name is required" },
      { status: 400 }
    );
  }


  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "Image upload failed" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");


  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }


  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);


  await writeFile(filepath, buffer);


  const category = await Category.create({
    categoryName,
    categoryImage: `/uploads/${filename}`,
  });


  return NextResponse.json({
    success: true,
    message: "Category created successfully",
    category,
  });
}

export async function GET(request:Request) {
  await connectDb()
  const category = await Category.find()
  if (!category) {
      return NextResponse.json({ result: "No products found", success: false }, { status: 201 })
  }
  return NextResponse.json({ message: "Products fetched successfully", category }, { status: 201 })
}