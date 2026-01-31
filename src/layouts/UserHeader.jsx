"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/Redux/features/language/languageSlice";
import { logout } from "@/Redux/features/auth/authSlice";

import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { setSearchQuery } from "@/Redux/features/search/searchSlice";
import { useGetProfileQuery } from "@/Redux/services/authApi";

export default function UserHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: user } = useGetProfileQuery();
  const totalItems = useSelector((state) =>
    state.cart.items
      .filter((item) => item.userId === user?.id)
      .reduce((total, item) => total + item.quantity, 0),
  );
  const totalFavorites = useSelector(
    (state) =>
      state.favorites.items.filter((item) => item.userId === user?.id).length,
  );
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage,
  );

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
            <div className="hidden sm:flex relative flex-1 justify-start items-center border-primary border rounded-md max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t("common.search")}
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
                onClick={() => dispatch(setLanguage("EN"))}
                className={`px-3 py-1 text-sm rounded font-medium ${
                  currentLanguage.toUpperCase() === "EN"
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => dispatch(setLanguage("NL"))}
                className={`px-3 py-1  text-sm rounded font-medium ${
                  currentLanguage.toUpperCase() === "NL"
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                NL
              </button>
              <button
                onClick={() => dispatch(setLanguage("FR"))}
                className={`px-3 py-1 text-sm rounded font-medium ${
                  currentLanguage.toUpperCase() === "FR"
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                FR
              </button>
            </div>

            {/* Favorites */}
            <button
              onClick={() => navigate("/favorites")}
              className="relative flex p-2 hover:bg-gray-100 rounded-full"
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
              className="p-2 hidden  sm:flex hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/auth/login");
                dispatch(setSearchQuery(""));
                window.location.reload();
              }}
              className="hidden sm:flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-400 font-medium"
            >
              <LogOut className="w-4 h-4" />
              {t("common.logout")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-4 flex py-4 justify-between">
              {/* Mobile Search Bar */}

              {/* Language Selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    dispatch(setLanguage("EN"));
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-sm rounded font-medium ${
                    currentLanguage.toUpperCase() === "EN"
                      ? "bg-primary text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    dispatch(setLanguage("NL"));
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-sm rounded font-medium ${
                    currentLanguage.toUpperCase() === "NL"
                      ? "bg-primary text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  NL
                </button>
                <button
                  onClick={() => {
                    dispatch(setLanguage("FR"));
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 text-sm rounded font-medium ${
                    currentLanguage.toUpperCase() === "FR"
                      ? "bg-primary text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  FR
                </button>
              </div>
              <button
                onClick={() => navigate("/account")}
                className="p-2  flex hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <User className="w-6 h-6 text-gray-700" />
              </button>
              {/* Menu Items */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/auth/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-400 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  {t("common.logout")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {location.pathname === "/" && (
        <div className=" m-3 relative md:hidden flex justify-start items-center border-primary border rounded-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t("common.search")}
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full border-none focus-visible:ring-primary bg-transparent pl-10"
          />
        </div>
      )}
    </header>
  );
}
