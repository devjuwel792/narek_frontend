import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./App.css";

import ProductCard from "./components/ProductCard";
import {
  useGetProductGroupsQuery,
  useGetProductsQuery,
} from "./Redux/services/productApi";
import { useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination";
import { useGetProfileQuery } from "./Redux/services/authApi";
import { useGetFavoritesQuery } from "./Redux/services/authApi";

export default function App() {
  const { t } = useTranslation();
  const currentLanguage = useSelector((state) => {
    return state.language.currentLanguage;
  });
  const searchQuery = useSelector((state) => state.search.query);

  const [selectedCategory, setSelectedCategory] = useState({
    name: "All",
    id: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data, error, isLoading } = useGetProductGroupsQuery();

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery({
    product_group_id:
      selectedCategory.name === "All" ? null : selectedCategory.id,
    productName: searchQuery,
    limit,
    offset: (currentPage - 1) * limit,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const { data: profile } = useGetProfileQuery();
  const { data: favorites } = useGetFavoritesQuery();

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
      ...item,
      id: item.id,
      name: item?.name,
      // category: item.product_group?.name,
      image:
        item?.pictures?.length > 0
          ? item.pictures.at(-1)
          : "/placeholder.png",
      // size: item.unit_code.name,
      // price: item.price._,
      // price_excl: item.price_excl,
      quantity: 0,
    }))
    : [];

  const filteredProducts = productList;
  console.log("🚀 ~ App ~ filteredProducts:", filteredProducts)

  // selectedCategory === "All"
  //   ? productList
  //   : productList.filter((product) => product.category === selectedCategory);

  const totalPages = productsData ? Math.ceil(productsData.count / limit) : 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
              className={`px-4 py-2 rounded-md whitespace-nowrap font-medium transition-colors ${""
                // selectedCategory?.name?.toLowerCase() == "all" && "w-20"
                } ${selectedCategory.id === cat.id
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Count */}
        <div className="mb-4 text-sm text-gray-600">
          {t('common.showingProducts', {
            from: filteredProducts.length > 0 ? (currentPage - 1) * limit + 1 : 0,
            to: Math.min(currentPage * limit, productsData?.count || 0),
            total: productsData?.count || 0
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {filteredProducts.map((product) => {
            console.log(product);
            return (
              <ProductCard
                key={product.id}
                product={{ ...product, image: product?.image?.public_path }}
                product_segment_id={profile?.contact_tier_id}
                currency={profile?.currency?.sign}
                fevIds={favorites || []}
              />
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Page numbers around current page */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}
