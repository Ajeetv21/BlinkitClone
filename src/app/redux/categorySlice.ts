import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";



interface Category {
    _id: string;
    categoryName: string;
    categoryImage: string;

}

interface CategoryState {
    categories: Category[];
    singleCategory: Category | null;
    loading: boolean;
    error: string | null;
}


const initialState: CategoryState = {
    categories: [],
    singleCategory: null,
    loading: false,
    error: null,
};


export const createCategory = createAsyncThunk(
    "category/create",
    async (
        { categoryName, categoryImage }: { categoryName: string, categoryImage: File; },
        { rejectWithValue }
    ) => {

        try {
            const formData = new FormData();
            formData.append("categoryName", categoryName);
            formData.append("categoryImage", categoryImage);

            console.log("Form Data Entries:", Array.from(formData.entries()));

            const res = await axios.post("/api/category", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;
        } catch (error: any) {
            console.error("Error creating category:", error);
            toast.error(error.response?.data?.message || "Category creation failed");
            return rejectWithValue(error.response?.data?.message || "An error occurred");
        }
    }
);



export const fetchCategory = createAsyncThunk("fetchCategory", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/category");

        return response.data.category;


    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
});




export const updateCategory = createAsyncThunk(
    "updateCategory",
    async ({ id, categoryName, categoryImage }: { id: string; categoryName: string; categoryImage: File }, { rejectWithValue }) => {

        // console.log("updated id",id)
        // console.log("updated id",categoryName)
        // console.log("updated id",categoryImage)

        try {
            const formData = new FormData();
            formData.append("categoryName", categoryName);
            formData.append("categoryImage", categoryImage);
            // console.log("Form Data:", Array.from(formData.entries()));
            const res = await axios.put(`/api/category/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;
        } catch (error: any) {
            console.error("Error updating category:", error);
            return rejectWithValue(error.response?.data?.message || "Failed to update category");
        }
    }
);



export const deleteCategory = createAsyncThunk<string, string>("deleteCategory", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/api/category/${id}`);
        return id;
    } catch (error: any) {
        console.error("Error fetching category", error)
        return rejectWithValue(error.response?.data?.message || "Failed to category");
    }
})
export const fetchSingleCategory = createAsyncThunk(
    "category/fetchSingleCategory",
    async (id: string, thunkAPI) => {
        try {
            const response = await axios.get(`/api/category/${id}`);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch user");
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(fetchCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action: { payload: string }) => {
                state.loading = false;
                state.categories = state.categories.filter((category: Category) => category._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(updateCategory.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action: { payload: Category }) => {
                const index = state.categories.findIndex(category => category._id === action.payload._id);

                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        builder

            .addCase(fetchSingleCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.singleCategory = action.payload;
            })
            .addCase(fetchSingleCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }

});

export default categorySlice.reducer;