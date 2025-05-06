  "use server"
import { NextResponse } from "next/server";
import connectDb from '@/app/lib/database';
import Category from "../../../../models/Category"
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
await connectDb();
interface ContextParams {
    params: { id: string };
}

export async function DELETE(request: Request, context: ContextParams) {
    await connectDb();
    const _id: string = context.params.id;

    try {
        
        const category = await Category.findByIdAndDelete(_id);
        console.log(category)

        if (!category) return NextResponse.json({ error: 'category not found' }, { status: 404 });

        return NextResponse.json(category);

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 501 });
    }

}

export async function PUT(request: Request, context: ContextParams) {
    await connectDb();
    const _id: string =  context.params.id;

    try {
        const formData = await request.formData();
        const rawCategoryName = formData.get("categoryName") as string | null;
        const categoryName = rawCategoryName?.trim();

        const fileData = formData.get("categoryImage") as File | null;
        const file = fileData instanceof File ? fileData : null;

        console.log("File:", file);
        console.log("Category Name:", categoryName);

    
        if (!categoryName || typeof categoryName !== "string") {
            return NextResponse.json(
                { success: false, message: "Category name is required" },
                { status: 400 }
            );
        }

        const updateData: { categoryName: string; categoryImage?: string } = {
            categoryName,
        };


        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), "public", "uploads");

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const sanitizedFileName = file.name.replace(/[^a-z0-9.\-_]/gi, '_');
            const filename = `${Date.now()}-${sanitizedFileName}`;
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);


            updateData.categoryImage = `/uploads/${filename}`;;
        }

        const updatedCategory = await Category.findByIdAndUpdate(_id, updateData, {
            new: true,
        });

        if (!updatedCategory) {
            return NextResponse.json(
                { success: false, message: "Category not found or update failed" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory,
        });
    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function GET(request:Request, context:ContextParams) {
    await connectDb()
    const _id: string = context.params.id;
   

    
    try {
        const category = await Category.findById(_id);
        if (!category) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        return NextResponse.json(category);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }


}
