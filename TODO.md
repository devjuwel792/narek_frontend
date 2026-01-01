# TODO: Add Local Store Favorite Option and Remove Backend Logic

- [x] Update src/components/ProductCard.jsx to use local Redux favorites state instead of backend API
  - Remove useAddToFavoritesMutation import and usage
  - Change handleToggleFavorite to dispatch toggleFavorite from favoritesSlice
  - Update isFavorite to derive from Redux state
  - Remove fevIds prop as it's no longer needed
- [x] Update src/pages/FavoritesPage.jsx to use local Redux favorites state instead of backend query
  - Remove useGetFavoritesQuery and useProductsByIds
  - Use favorites state from Redux to get product IDs
  - Use useGetProductsByIdsQuery from productApi to fetch products
