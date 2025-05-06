import mongoose ,{Document,Schema,model,models} from "mongoose"


export interface IProduct extends Document{
  productName:string;
  productDescription:string;
  productPrice:number;
  productImage:string;
  category:mongoose.Types.ObjectId;
  subcategory:mongoose.Types.ObjectId;


}

const productSchema = new Schema<IProduct>({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String, 
    required: true,
  },
  category:{
     type:mongoose.Schema.Types.ObjectId, 
     ref:"Category", 
     required:true 
  },
  subcategory:{
      type:mongoose.Schema.Types.ObjectId, 
      ref:"Subcategory",
      required:true
  }
}, 
{ timestamps: true,}
);


const Product = models.Product || model<IProduct>("Product", productSchema);
export default Product;