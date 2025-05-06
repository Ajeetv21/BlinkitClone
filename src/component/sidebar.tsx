"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);




    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    if (!isMounted) {
        return null;
    }

    const handleLogout = async () => {
        try {
            axios.get("/api/auth/logout")
            toast.success("Logout successfully")
            router.push("/login")
            router.refresh();
        } catch (error: any) {
            toast.error("logout error")
            console.log(error.message)
        }
    }

    return (
        <div className="flex">
            <button type="button"
                onClick={toggleSidebar}
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden"
            >
                {isOpen ? "Close" : "Menu"}
            </button>

            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out md:translate-x-0`}
            >
                <div className="p-4 text-lg font-bold border-b border-gray-700 flex justify-between items-center">
                    <Link href="/admindashboard">
                        <h2 className="items-center text-center">
                            sidebar
                        </h2>
                    </Link>
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="text-white bg-gray-800 rounded md:hidden"
                    >
                        X
                    </button>
                </div>
                <nav className="p-4 space-y-2 mt-4 text-center items-center font-serif font-bold">
                    <Link href="/profile" passHref>
                        <span className="block px-3 py-2 mt-4 rounded hover:bg-gray-700">
                            Profile
                        </span>
                    </Link>
                    <Link href="/category" className="block px-3 py-2 mt-4 rounded hover:bg-gray-700">
                        Category
                    </Link>
                    <Link href="/subcategory" className="block px-3 py-2 mt-4 rounded hover:bg-gray-700">
                        Subcategory
                    </Link>
                    <Link href="/settings" className="block px-3 py-2 mt-4 rounded hover:bg-gray-700">
                        Settings
                    </Link>
                    <Link href="/product" className="block px-3 py-2 mt-4 rounded hover:bg-gray-700">
                        Product
                    </Link>

                    <button type="button"
                        onClick={handleLogout}
                        className="block w-[80%] px-3 py-2 mt-4 ml-3 items-center rounded bg-red-700 hover:bg-red-800"
                    >
                        Logout
                    </button>
                </nav>
            </div>


        </div>
    );
}


export default Sidebar;