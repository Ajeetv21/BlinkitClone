import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export interface product {
    _id: string;
    productName: string;
    productDescription: string;
    productPrice: number
    productImage: string;
    category: {
        _id: string;
        categoryName: string;
    };
    subCategory: {
        _id: string;
        subcategoryName: string;
    }
}

interface ProductState {
    products: product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/product');
            console.log("this is resposnse data",response.data)
            return response.data.data

            
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch subcategories");
        }
    }
);

export const addProduct = createAsyncThunk(
    "subcategory/addSubcategory",
    async (
        {
            productName,
            productPrice,
            productImage,
            productDescription,
            category,
            subcategory
        }: { productName: string; productPrice:number; productDescription:string; category: string; productImage: File,subcategory:string },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append("productName", productName);
            formData.append("productPrice", productPrice.toString());
            formData.append("productDescription",productDescription);
            formData.append("category", category);
            formData.append("subcategory", subcategory);
            formData.append("productImage", productImage);

            console.log(formData)

            const response = await axios.post("/api/product/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            // console.log(response);
            // toast.success(response);
            return response.data;
        } catch (error: any) {
            console.error("Error in addProduct", error)
            return rejectWithValue(error.response?.data?.message || "Failed to add subcategory");
        }
    }
);


const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

       builder 
       
             .addCase(addProduct.pending, (state) => {
                             state.loading = true;
                             state.error = null
                         })
                         .addCase(addProduct.fulfilled, (state, action) => {
                             state.products.push(action.payload);
                         })
                         .addCase(addProduct.rejected, (state, action) => {
                             state.loading = false;
                             state.error = action.payload as string;
                         })
                         // Update
                        
    }
})

export default ProductSlice.reducer;