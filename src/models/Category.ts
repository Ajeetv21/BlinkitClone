import mongoose, { Document, Schema, model, models } from "mongoose"


export interface ICategory extends Document {
    categoryName: string;
    categoryImage: string;
}
const categorySchema = new Schema<ICategory>({
    categoryName: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
});

const Category = models.Category || model<ICategory>("Category", categorySchema);
export default Category;
