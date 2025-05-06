import React from "react";
import { Product } from "./types/Product";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-100 transition">
      <td className="px-5 py-4">
        <img src={product.productImage} alt={product.productName} className="w-12 h-12 object-cover rounded-md" />
      </td>
      <td className="px-5 py-4">{product.productName}</td>
      <td className="px-5 py-4">₹{product.productPrice}</td>
      <td className="px-5 py-4">{product.productDescription}</td>
      <td className="px-5 py-4">{product?.category?.categoryName}</td>

      <td className="px-5 py-4 flex gap-2">
        <button  type="button" onClick={() => onEdit(product)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm">
          Edit
        </button>
        <button type="button" onClick={() => onDelete(product._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
