# TODO: Add Product Pagination

- [x] Update `src/Redux/services/productApi.js` to include `limit` and `offset` parameters in the `getProducts` query.
- [x] Update `src/App.jsx` to pass default `limit` (e.g., 100) and `offset` (e.g., 0) to the `useGetProductsQuery` hook.
- [x] Add pagination UI to `src/App.jsx` using the existing pagination component, with state for current page and handlers for page changes.
- [x] Test the changes to ensure pagination works with the API response structure and UI controls.
