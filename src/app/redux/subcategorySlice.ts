
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Subcategory {
    _id: string;
    subcategoryName: string;
    subcategoryImage: string;
    category: {
        _id: string;
        categoryName: string;
    };
}

interface SubcategoryState {
    subcategories: Subcategory[];
    selectedSubcategory: Subcategory | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubcategoryState = {
    subcategories: [],
    selectedSubcategory: null,
    loading: false,
    error: null,
};


export const fetchSubcategories = createAsyncThunk(
    "subcategory/fetchSubcategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/api/subCategory/");
            return response.data.subcategories;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch subcategories");
        }
    }
);


export const fetchSingleSubcategory = createAsyncThunk(
    "subcategory/fetchSingleSubcategory",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/subCategory/${id}`);
            // console.log(response.data.subCategory)
            return response.data.subCategory;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch subcategory");
        }
    }
);


export const addSubcategory = createAsyncThunk(
    "subcategory/addSubcategory",
    async (
        {
            subcategoryName,
            category,
            subcategoryImage,
        }: { subcategoryName: string; category: string; subcategoryImage: File },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append("subcategoryName", subcategoryName);
            formData.append("category", category);
            formData.append("subcategoryImage", subcategoryImage);

            const response = await axios.post("/api/subCategory/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return response.data;
        } catch (error: any) {
            console.error("Error in addsubcategory", error)
            return rejectWithValue(error.response?.data?.message || "Failed to add subcategory");
        }
    }
);


export const updateSubcategory = createAsyncThunk(
    "subcategory/updateSubcategory",
    async (
        {
            id,
            subcategoryName,
            category,
            subcategoryImage,
        }: {
            id: string;
            subcategoryName: string;
            category: string;
            subcategoryImage?: File;
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append("subcategoryName", subcategoryName);
            formData.append("categoryId", category);
            if (subcategoryImage) {
                formData.append("subcategoryImage", subcategoryImage);
            }

            const response = await axios.put(`/api/subCategory/${id}`, formData);
            return response.data.subcategory;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update subcategory");
        }
    }
);


export const deleteSubcategory = createAsyncThunk(
    "subcategory/deleteSubcategory",
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/subCategory/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete subcategory");
        }
    }
);


const subcategorySlice = createSlice({
    name: "subcategory",
    initialState,
    reducers: {
        clearSelectedSubcategory(state) {
            state.selectedSubcategory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchSubcategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.loading = false;
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch single
            .addCase(fetchSingleSubcategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSingleSubcategory.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSubcategory = action.payload;
            })
            .addCase(fetchSingleSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


        builder
            .addCase(addSubcategory.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(addSubcategory.fulfilled, (state, action) => {
                state.subcategories.push(action.payload);
            })
            .addCase(addSubcategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateSubcategory.fulfilled, (state, action) => {
                state.subcategories = state.subcategories.map((sc) =>
                    sc._id === action.payload._id ? action.payload : sc
                );
            })

            // Delete
            .addCase(deleteSubcategory.fulfilled, (state, action) => {
                state.subcategories = state.subcategories.filter((sc) => sc._id !== action.payload);
            });
    },
});

export const { clearSelectedSubcategory } = subcategorySlice.actions;

export default subcategorySlice.reducer;
