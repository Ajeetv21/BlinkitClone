import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/lib/database";
import path from "path";
import fs from 'fs';
import Product from "@/models/Product";
import Category from "@/models/Category"
import { writeFile } from "fs/promises";



export async function POST(request:Request) {
    await connectDb();

    const formData = await request.formData();
    const file = formData.get("productImage");
    const productName = formData.get("productName");
    const productDescription = formData.get("productDescription");
    const productPrice = formData.get("productPrice");
    const category = formData.get("category");
    const subcategory= formData.get("subcategory");

  
    if (!category) {
        return NextResponse.json({ success: false, message: "Category is required" }, { status: 400 });
    }
    if (!subcategory) {
        return NextResponse.json({ success: false, message: "Category is required" }, { status: 400 });
    }

    if (!file || typeof file === "string") {
        return NextResponse.json({ success: false, message: "Image upload failed" }, { status: 400 });
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

    const product = await Product.create({
        productName,
        productDescription,
        productPrice,
        category: category,
        subcategory: subcategory,
        productImage: `/uploads/${filename}`,
    });

    return NextResponse.json({ success: true, message: "Product created", product });
}

export const GET = async () => {
    try {
        await connectDb()

        const products = await Product.find().populate('category')

        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch products', error: error },
            { status: 500 }
        );
    }
};
