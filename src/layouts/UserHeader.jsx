"use client";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ShoppingCart, User, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UserHeader() {
  const navigate = useNavigate();
  const totalItems = useSelector((state) => state.cart.totalItems);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex-shrink-0 cursor-pointer"
          >
            <img src="./logo.png" alt="" className="w-40" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-start  items-center border-primary border rounded-md  max-w-md">
            <Search className="absolute w-4 h-4 ml-3 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Product"
              className="w-full border-none focus-visible:ring-primary bg-transparent pl-10"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selection */}
            <div className="hidden sm:flex gap-2">
              <button className="px-3 py-1 bg-primary text-white text-sm rounded font-medium">
                EN
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                NL
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                FR
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate("/order")}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("/account")}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logout */}
            <button
              onClick={() => navigate("/auth/login")}
              className="hidden sm:flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-400 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
