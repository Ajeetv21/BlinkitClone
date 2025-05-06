"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import React, { useEffect, useState } from "react";
import { fetchCategory } from "@/app/redux/categorySlice";
import { fetchSubcategories } from "@/app/redux/subcategorySlice";
import { addProduct, fetchProducts } from "@/app/redux/productSlice";
import { toast } from "react-toastify";

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const { subcategories } = useAppSelector((state) => state.subcategory);
  const { products, loading: productLoading, error: productError } = useAppSelector(
    (state) => state.product
  );

  const [formData, setFormData] = useState<{
    productName: string;
    productPrice: number;
    productImage: File | null;
    productDescription: string;
    category: string;
    subcategory: string;
  }>({
    productName: "",
    productPrice: 0,
    productImage: null,
    productDescription: "",
    category: "",
    subcategory: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchProducts());
      dispatch(fetchSubcategories());
      const result = await dispatch(fetchCategory()).unwrap();
      // console.log("Fetched categories:", result);
    };

    fetchData();
  }, [dispatch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFormData({
      productName: "",
      productPrice: 0,
      productImage: null,
      productDescription: "",
      category: "",
      subcategory: "",
    });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const { productName, productPrice, productImage, productDescription, subcategory, category } = formData;
    if (!productName || !productPrice || !category || !subcategory || !productImage || !productDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    if (productImage.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    try {
      await dispatch(
        addProduct({ productName, productPrice, productImage, productDescription, subcategory, category })
      ).unwrap();
      toast.success("Subcategory added successfully");
      dispatch(fetchSubcategories()).unwrap()
      setFormData({
        productName: "",
        productPrice: 0,
        productDescription: "",
        subcategory: "",
        category: "",
        productImage: null,

      });
      dispatch(fetchProducts());
    } catch (error) {
      toast.error(error as string);
    }

  };





  return (
    <div className="flex flex-col items-center w-[80vw] h-full bg-gray-50 p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-4">
          <h1 className="text-xl font-semibold">Product Management</h1>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={handleOpenPopup}
          >
            Add Product
          </button>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-100">
                <td className="px-4 py-2">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-12 h-12 rounded-md"
                  />
                </td>
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.productPrice}</td>
                <td className="px-4 py-2">{product.productDescription}</td>
                <td className="px-4 py-2">
                  {categories.find((category) => category._id === product?.category?._id)?.categoryName || "Unknown"}
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-100">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <form onSubmit={submitHandler}>
          <div className="fixed inset-0 bg-[#0a112464] bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
              <div className="mb-2">
                <label htmlFor="productName" className="block text-sm font-medium">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Enter product name"
                  className="w-full p-2 border rounded"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productPrice" className="block text-sm font-medium">
                  Product Price
                </label>
                <input
                  type="number"
                  id="productPrice"
                  placeholder="Enter product price"
                  className="w-full p-2 border rounded"
                  value={formData.productPrice}
                  onChange={(e) => setFormData({ ...formData, productPrice: parseFloat(e.target.value) })}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productDescription" className="block text-sm font-medium">
                  Product Description
                </label>
                <textarea
                  id="productDescription"
                  placeholder="Enter product description"
                  className="w-full p-2 border rounded"
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="productCategory" className="block text-sm font-medium">
                  Product Category
                </label>
                <select
                  id="productCategory"
                  className="w-full p-2 border rounded"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                      subcategory: "",
                    }))
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="productSubcategory" className="block text-sm font-medium">
                  Product Subcategory
                </label>
                <select
                  id="productSubcategory"
                  className="w-full p-2 border rounded"
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subcategory: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Subcategory</option>
                  {subcategories
                    .filter((subcategory) => subcategory.category && subcategory.category._id === formData.category)
                    .map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subcategoryName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="productImage" className="block text-sm font-medium">
                  Product Image
                </label>
                <input
                  type="file"
                  id="productImage"
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setFormData({ ...formData, productImage: e.target.files ? e.target.files[0] : null })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductPage;