"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import { redirect } from "next/dist/server/api-utils";
import { toast } from "react-toastify";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/signup`, userData);
      toast.success("Signup successful!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/login`, userData);
      toast.success("Login successful!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


interface AuthState {
  user: {
    username: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      toast.info("Logged out successfully!");
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

   
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;