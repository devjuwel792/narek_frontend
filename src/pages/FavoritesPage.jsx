import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.favorites.items);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No favorite products yet.</p>
            <p className="text-gray-400">Click the heart icon on products to add them to favorites.</p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
