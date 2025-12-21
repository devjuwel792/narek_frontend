import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css";

import ProductCard from "./components/ProductCard";
import { useGetProductGroupsQuery, useGetProductsQuery } from "./Redux/services/productApi";
import { useSelector } from "react-redux";





export default function App() {
  const currentLanguage = useSelector((state) => {
    return state.language.currentLanguage;
  });

  const [selectedCategory, setSelectedCategory] = useState({
    name: "All",
    id: null,
  });
  const { data, error, isLoading } = useGetProductGroupsQuery();
 
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery({
    product_group_id:
      selectedCategory.name === "All" ? null : selectedCategory.id,
  });

 

  const productGroups = data
    ? [
        { name: "All", id: null },
        ...data.items.map((item) => {
          return {
            name: item.name,
            id: item.id,
          };
        }),
      ]
    : [{ name: "All", id: null }];

  const productList = productsData
    ? productsData.items.map((item) => ({
        id: item.id,
        name: item?.name,
        // category: item.product_group?.name,
        image: item?.pictures?.length > 0 ? item.pictures[0] : "/placeholder.png",
        // size: item.unit_code.name,
        // price: item.price._,
        price_excl: item.price_excl,
         quantity: 0,
      }))
    : [];

  const filteredProducts = productList;
  // selectedCategory === "All"
  //   ? productList
  //   : productList.filter((product) => product.category === selectedCategory);

  if (isLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error loading data
      </div>
    );
  }
  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {productGroups.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md whitespace-nowrap font-medium transition-colors ${
                ""
                // selectedCategory?.name?.toLowerCase() == "all" && "w-20"
              } ${
                selectedCategory.id === cat.id
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
