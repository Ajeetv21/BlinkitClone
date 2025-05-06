"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { login } from "../../redux/authslice";
import Link from "next/link";
import { useRouter } from "next/navigation";


const LoginPage = () => {
  
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router=useRouter();
  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const result = await dispatch(login(formData)).unwrap(); 
      console.log("Login success:", result);
      sessionStorage.setItem("user", JSON.stringify(result.user));
      sessionStorage.setItem("token", result.token);
    if (result.user.role === "admin") {
      router.push("/admindashboard");
      } else {
      router.push("/customerdashboard");
      }
    } catch (error) {
      console.log("Login error:", error);
    
    }   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-medium rounded-md ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-[#5832a8] hover:bg-[#4e3e71]"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {loading ? "login..." : "Login"}
          </button>
          <p className='text-center'> Create new Account please? <span className='text-[#5832a8] font-semibold'><Link href={"/signup"}>Signup</Link></span></p>
        </form>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {isAuthenticated }
      </div>
     
        
    </div>
  );
};

export default LoginPage;