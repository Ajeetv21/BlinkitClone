"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import React, { useEffect, useState, useRef } from "react";
import { addSubcategory, deleteSubcategory, fetchSubcategories } from "@/app/redux/subcategorySlice";
import { fetchCategory } from "@/app/redux/categorySlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function Subcategory() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { categories, loading: categoryLoading, error: categoryError } = useAppSelector(
    (state) => state.category
  );
  const { subcategories, loading, error } = useAppSelector((state) => state.subcategory)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [hasMounted, setHasMounted] = useState(false);

  const [formData, setFormData] = useState<{
    subcategoryName: string;
    category: string;
    subcategoryImage: File | null;
  }>({
    subcategoryName: "",
    category: "",
    subcategoryImage: null,
  });

  useEffect(() => {
    setHasMounted(true);
    dispatch(fetchSubcategories()).unwrap()
    dispatch(fetchCategory());

  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { subcategoryName, category, subcategoryImage } = formData;

    if (!subcategoryName || !subcategoryImage || !category) {
      toast.error("Please fill in all fields");
      return;
    }


    if (subcategoryImage.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    try {
      await dispatch(
        addSubcategory({ subcategoryName, category, subcategoryImage })
      ).unwrap();
      toast.success("Subcategory added successfully");
      dispatch(fetchSubcategories()).unwrap()
      setFormData({
        subcategoryName: "",
        category: "",
        subcategoryImage: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error as string);
    }
  };

  if (!hasMounted || categoryLoading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubCategories = subcategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);


  const handleEdit = (id: any) => {
    router.push(`/subcategory/edit/${id}`)
  };

  const handleDelete = async (id: any) => {
    try {
      await dispatch(deleteSubcategory(id)).unwrap();
      toast.success("Category deleted");
      dispatch(fetchSubcategories()).unwrap()
    } catch (err) {
      toast.error((err as any)?.message || "Failed to delete");
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center w-[80vw] h-[95.5vh]">
      <div className="flex justify-center">
        <div className="bg-gray-800 text-white p-6 rounded-md w-full max-w-md ">
          <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Subcategory Name"
              value={formData.subcategoryName}
              onChange={(e) => setFormData({ ...formData, subcategoryName: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />

            <label htmlFor="categorySelect" className="block text-sm font-medium text-white">
              Select Category
            </label>
            <select
              id="categorySelect"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category: any) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              placeholder="Enter your subcategoryImage"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFormData({ ...formData, subcategoryImage: e.target.files[0] });
                }
              }}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
            >
              Add Subcategory
            </button>
          </form>
        </div>
      </div>
      <div className="mt-10 overflow-x-auto w-[40vw] rounded-md">
        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentSubCategories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-2">
                  <img src={cat.subcategoryImage} alt={cat.subcategoryName} className="w-12 h-12 rounded" />
                </td>
                <td className="px-4 py-2">{cat.subcategoryName}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(cat._id)} type="button" className="bg-green-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(cat._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button type="button"
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
