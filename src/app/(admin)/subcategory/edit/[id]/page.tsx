"use client"
import React, { use, useEffect, useState } from 'react'
import { fetchSingleSubcategory, updateSubcategory } from '@/app/redux/subcategorySlice';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/app/redux/hook';
import { fetchCategory } from '@/app/redux/categorySlice';
import { useRouter } from "next/navigation";
const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = use(params);

  const { categories, loading: categoryLoading, error: categoryError } = useAppSelector(
    (state) => state.category
  );
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

    dispatch(fetchSingleSubcategory(id)).then((response) => {
      if (response.payload) {
        setFormData({
          subcategoryName: response.payload.subcategoryName || "",
          category: response.payload.category || "",
          subcategoryImage: response.payload.subcategoryName,
        });
      } else {
        toast.error("Failed to fetch category details");
      }
    });
    dispatch(fetchCategory());

  }, [dispatch, id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!formData.subcategoryImage) {
      toast.error("Please select an image");
      return;
    }
    try {
      await dispatch(
        updateSubcategory({
          id,
          subcategoryName: formData.subcategoryName,
          category: formData.category,
          subcategoryImage: formData.subcategoryImage,

        })
      ).unwrap();

      toast.success("Category updated successfully");
      router.back();
    } catch (err) {
      console.error("Error updating category:", err);
    }


  }

  console.log("fetch single data", formData)
  return (
    <div>

      <div className="bg-gray-800 text-white p-6 rounded-md w-full max-w-md">
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
  )
}

export default page