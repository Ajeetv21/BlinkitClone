import connectDb from "@/app/lib/database";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import Category from "../../../../models/Category"
// import subCategory from "../../../../models/SubCategory"
import SubCategory from "@/models/SubCategory";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await connectDb();
    try {
        const subCategory = await SubCategory.findById(params.id).populate("category")

        if (!subCategory) {
            return NextResponse.json({ success: false, message: "subcategory is not found" }, { status: 404 })
        }
        return NextResponse.json({ success: true, subCategory }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
    await connectDb();
    const _id: string = context.params.id;

    try {

        const deletedSubCategory = await SubCategory.findByIdAndDelete(_id);
        console.log(deletedSubCategory);

        if (!deletedSubCategory) return NextResponse.json({ error: 'subcategory not found' }, { status: 404 });

        return NextResponse.json(deletedSubCategory);

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 501 });
    }

}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectDb();

    try {
        const formData = await req.formData();
        const subcategoryName = formData.get("subcategoryName") as string;
        const category = formData.get("category") as string;
        const file = formData.get("subcategoryImage") as File | null;

        const updateData: any = {
            subcategoryName,
            category,
        };

        if (file && typeof file.name === "string") {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filename = `${Date.now()}-${file.name}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);

            updateData.subcategoryImage = `/uploads/${filename}`;
        }

        const updated = await SubCategory.findByIdAndUpdate(params.id, updateData, { new: true });

        if (!updated) {
            return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Subcategory updated", subcategory: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
