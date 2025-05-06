 "use server"
import connectDb from "@/app/lib/database";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


export async function GET(request: Request, context: { params: { id: string } }) {
    await connectDb()
    const { id } = context.params;
   

    
    try {
        const product = await Product.findById(id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        return NextResponse.json(product);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }


}

export async function PATCH(request: Request, context: { params: { id: string } }) {
    await connectDb();
    const { params } = context; 
    const id = params.id;
  
    const formData = await request.formData();
  
    const productName = formData.get("productName");
    const productPrice = formData.get("productPrice");
    const productDescription = formData.get("productDescription");
    const productCategory = formData.get("productCategory");
    const productImage = formData.get("productImage");
  
    const updateData: {
      productName: FormDataEntryValue | null;
      productPrice: FormDataEntryValue | null;
      productDescription: FormDataEntryValue | null;
      productCategory: FormDataEntryValue | null;
      productImage?: string;
    } = {
      productName,
      productPrice,
      productDescription,
      productCategory,
    };
  
    if (productImage instanceof File) {
      const uploadDir = "public/uploads";
      const filePath = path.join(uploadDir, `${Date.now()}-${productImage.name}`);
      const buffer = Buffer.from(await productImage.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      updateData.productImage = filePath.replace("public", "");
    }
  
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
  
    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Update failed" }, { status: 400 });
    }
  
    return NextResponse.json({ success: true, message: "Product updated", product: updatedProduct }, { status: 200 });
  }

export async function DELETE(request: Request, context: { params: { id: string } }) {
    await connectDb()
    const { params } = context; 
    const id = params.id;
    try {
        const product = await Product.findByIdAndDelete({
            _id:id});
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        return NextResponse.json(product);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    

}

