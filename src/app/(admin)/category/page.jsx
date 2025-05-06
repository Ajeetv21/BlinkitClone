"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import React, { useEffect, useState, useRef } from "react";
import { fetchCategory, createCategory, deleteCategory } from "@/app/redux/categorySlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Category() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const { categories, loading, error } = useAppSelector((state) => state.category);

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { categoryName, categoryImage } = formData;



    if (!categoryName || !categoryImage) {
      toast.error("Please fill in all fields");
      return;
    }
    if (categoryImage.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    try {
      await dispatch(
        createCategory({ categoryName, categoryImage })
      ).unwrap();
      toast.success("Subcategory added successfully");
      dispatch(fetchCategory()).unwrap()
      setFormData({
        categoryName: "",
        categoryImage: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted");
      dispatch(fetchCategory());
    } catch (err) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  const handleEdit = (id) => {
    router.push(`/category/edit/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="p-4 flex flex-col justify-center items-center w-[80vw] h-[95vh] rounded-sm">

      <div className="flex justify-center">
        <div className="bg-gray-800 text-white p-6 rounded-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setFormData({ ...formData, categoryImage: e.target.files[0] })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
            >
              Add Category
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>


      <div className="mt-10 overflow-x-auto w-[50vw] rounded-sm">
        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-2">
                  <img src={cat.categoryImage} alt={cat.categoryName} className="w-12 h-12 rounded" />
                </td>
                <td className="px-4 py-2">{cat.categoryName}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(cat._id)} className="bg-green-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
