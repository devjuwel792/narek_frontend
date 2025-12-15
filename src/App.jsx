import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./App.css";

import ProductCard from "./components/ProductCard";

const productList = [
  {
    id: 1,
    name: "Coca-Cola Classic",
    size: "330ml x 24",
    image: "/image 1.png",
    quantity: 1,
    category: "Soft Drink",
  },
  {
    id: 2,
    name: "Coca-Cola Zero",
    size: "330ml x 24",
    image: "/image 13.png",
    quantity: 0,
    category: "Soft Drink",
  },
  {
    id: 3,
    name: "Sprite",
    size: "290ml x 24",
    image: "/image 15.png",
    quantity: 0,
    category: "Soft Drink",
  },
  {
    id: 4,
    name: "Fanta Orange",
    size: "330ml x 24",
    image: "/image 16.png",
    quantity: 0,
    category: "Soft Drink",
  },
  {
    id: 5,
    name: "Evian Still Water",
    size: "500ml x 24",
    image: "/image 17.png",
    quantity: 0,
    category: "Water",
  },
  {
    id: 6,
    name: "Spa Reine",
    size: "500ml x 24",
    image: "/image 10.png",
    quantity: 0,
    category: "Water",
  },
  {
    id: 7,
    name: "Tropicana Orange",
    size: "500ml x 24",
    image: "/image 11.png",
    quantity: 0,
    category: "Juice",
  },
  {
    id: 8,
    name: "Schweppes Bitter Lemon Drink",
    size: "330ml x 24",
    image: "/image 18.png",
    quantity: 0,
    category: "Soft Drink",
  },
];

const categories = ["All", "Soft Drink", "Water", "Juice", "Energy Drink"];

export default function App() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? productList
      : productList.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md whitespace-nowrap font-medium transition-colors ${
                cat?.toLowerCase() == "all" && "w-20"
              } ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat}
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
