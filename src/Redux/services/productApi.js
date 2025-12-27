import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api5.onfact.be/v1",
  }),
  endpoints: (builder) => ({
    getProductGroups: builder.query({
      query: () => ({
        url: "/product-groups.json",
        headers: {
          "X-SESSION-KEY": import.meta.env.VITE_ONFACT_API_KEY,
        },
      }),
    }),
    getProducts: builder.query({
      query: ({ product_group_id, productName, limit = 100, offset = 0 }) => (
        {
        url: "/products.json?",
        params: {
          q: `${product_group_id ? `productgroup_id:${product_group_id} ${product_group_id && productName && " AND "} ` : ''}${productName ? `name:${productName}*` : ''}`.trim(),
          limit,
          offset,
        },
        headers: {
          "X-SESSION-KEY": import.meta.env.VITE_ONFACT_API_KEY,
        },
      }),
    }),
  }),
});

export const { useGetProductGroupsQuery, useGetProductsQuery } = productApi;
