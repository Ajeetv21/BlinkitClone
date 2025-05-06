"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import React, { useEffect, useState, useRef, use } from "react";
import { fetchSingleCategory, updateCategory } from "@/app/redux/categorySlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { id } = use(params);

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchSingleCategory(id)).then((response) => {
      if (response.payload) {
        setFormData({
          categoryName: response.payload.categoryName || "",
          categoryImage: null, 
        });
      } else {
        toast.error("Failed to fetch category details");
      }
    });
  }, [dispatch, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryImage) {
      toast.error("Please select an image");
      return;
    }

    try {
      await dispatch(
        updateCategory({
          id,
          categoryName: formData.categoryName,
          categoryImage: formData.categoryImage,
        })
      ).unwrap();

      toast.success("Category updated successfully");
      router.back();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const { loading, error } = useAppSelector((state) => state.category);

  return (
    <div className="flex  justify-center items-center w-[80vw] h-[80vh]">
      <div className="p-6 bg-gray-800 text-white rounded">
        <h2 className="text-2xl font-bold mb-4">Update Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm  font-medium" >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="w-full border p-2 rounded mt-1 text-white "
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="categoryImage" className="block text-sm font-medium">
              Category Image
            </label>
            <input
              id="categoryImage"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryImage: e.target.files?.[0] || null,
                })
              }
              className="border border-gray-300 rounded p-2"
            />
          </div>

          <div className="items-center text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
              disabled={loading}
            >
              Update Category
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Page;
