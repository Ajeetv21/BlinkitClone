
import mongoose ,{Document,Schema,model,models} from "mongoose"
export interface ISubcategory extends Document{
  subcategoryName:string;
  category:mongoose.Types.ObjectId;
  subcategoryImage:string;

}
const subcategorySchema = new Schema<ISubcategory>(
    {
        subcategoryName: {
            type: String,
            required: [true, "Subcategory name is required"],
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subcategoryImage: {
            type: String,
            required: true,
        }

    },
    { timestamps: true, }
);
const Subcategory  = models.Subcategory || model<ISubcategory>("Subcategory", subcategorySchema);
export default Subcategory;

