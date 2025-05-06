"use client";
import React, { useState } from "react";

const ProductForm = () => {

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productImage, setProductImage] = useState(null);


  const handleSubmit = (e:any) => {
    e.preventDefault();

   
    const formData = {
      productName,
      productPrice,
      productDescription,
      productCategory,
      productSubCategory,
      productImage,
    };

    console.log("Form Data Submitted:", formData);
    setProductName("");
    setProductPrice("");
    setProductDescription("");
    setProductCategory("");
    setProductSubCategory("");
    setProductImage(null);
  };

 
  const handleImageChange = (e:any) => {
    const file = e.target.files[0];
    setProductImage(file);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium">
            Product Price
          </label>
          <input
            type="text"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Enter product price"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium">
            Product Description
          </label>
          <input
            type="text"
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="productCategory" className="block text-sm font-medium">
            Product Category
          </label>
          <input
            type="text"
            id="productCategory"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            placeholder="Enter product category"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="productSubCategory" className="block text-sm font-medium">
            Product Sub-Category
          </label>
          <input
            type="text"
            id="productSubCategory"
            value={productSubCategory}
            onChange={(e) => setProductSubCategory(e.target.value)}
            placeholder="Enter product sub-category"
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label htmlFor="productImage" className="block text-sm font-medium">
            Product Image
          </label>
          <input
            type="file"
            id="productImage"
            onChange={handleImageChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
