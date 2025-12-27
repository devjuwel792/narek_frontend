import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.favorites.items);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">{t('favoritesPage.title')}</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('favoritesPage.noFavorites')}</p>
            <p className="text-gray-400">{t('favoritesPage.noFavoritesDesc')}</p>
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
