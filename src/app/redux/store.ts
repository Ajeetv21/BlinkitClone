
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"
import categoryReducer from './categorySlice'
import subcategoryReducer  from "./subcategorySlice"
import productReducer from "./productSlice"
export const store = configureStore({
  reducer:{
    auth:authReducer,
    category:categoryReducer,
    subcategory:subcategoryReducer,
    product:productReducer
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


