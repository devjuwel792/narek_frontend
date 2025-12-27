"use client";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/Redux/features/language/languageSlice";

import { ShoppingCart, User, LogOut, Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { setSearchQuery } from "@/Redux/features/search/searchSlice";

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const totalItems = useSelector((state) => state.cart.totalItems);
  const totalFavorites = useSelector((state) => state.favorites.items.length);
  const currentLanguage = useSelector((state) => state.language.currentLanguage);
  const searchQuery = useSelector((state) => state.search.query);

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
          {location.pathname === "/" && (
            <div className="relative flex-1 flex justify-start items-center border-primary border rounded-md max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full border-none focus-visible:ring-primary bg-transparent pl-10"
              />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selection */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => dispatch(setLanguage('EN'))}
                className={`px-3 py-1 text-sm rounded font-medium ${
                  currentLanguage.toUpperCase() === 'EN'
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => dispatch(setLanguage('NL'))}
                className={`px-3 py-1 text-sm rounded font-medium ${
                  currentLanguage.toUpperCase() === 'NL'
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                NL
              </button>
              <button
                onClick={() => dispatch(setLanguage('FR'))}
                className={`px-3 py-1 text-sm rounded font-medium ${
                  currentLanguage.toUpperCase() === 'FR'
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                FR
              </button>
            </div>

            {/* Favorites */}
            <button
              onClick={() => navigate("/favorites")}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className="w-6 h-6 text-gray-700" />
              {totalFavorites > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </button>

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
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
