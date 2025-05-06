import { NextResponse } from "next/server";
import SubCategory from "@/models/SubCategory";
import Category from "../../../models/Category";
import connectDb from "../../lib/database";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: Request): Promise<Response> {
    await connectDb();

    try {
        const formData = await request.formData();
        const subcategoryName = formData.get("subcategoryName") as string | null;
        const category = formData.get("category") as string | null;
        const file = formData.get("subcategoryImage") as File | null;
        console.log("File:", file);
        console.log("Subcategory Name:", subcategoryName);
        console.log("Category ID:", category);


        if (!subcategoryName || typeof subcategoryName !== "string") {
            return NextResponse.json(
                { success: false, message: "Subcategory name is required" },
                { status: 400 }
            );
        }


        if (!category || typeof category !== "string") {
            return NextResponse.json(
                { success: false, message: "Category ID is required" },
                { status: 400 }
            );
        }


        const foundCategory = await Category.findById(category);
        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
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


        const subcategory = await SubCategory.create({
            subcategoryName: subcategoryName,
            category: foundCategory,
            subcategoryImage: `/uploads/${filename}`,
        });

        return NextResponse.json({
            success: true,
            message: "Subcategory created successfully",
            subcategory,
        });
    } catch (error: any) {
        console.error("Error creating subcategory:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request): Promise<Response> {
    await connectDb();

    try {
        const subcategories = await SubCategory.find().populate("category");

        if (!subcategories || subcategories.length === 0) {
            return NextResponse.json(
                { success: false, message: "No subcategories found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Subcategories fetched successfully",
            subcategories,
        });
    } catch (error: any) {
        console.error("Error fetching subcategories:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}