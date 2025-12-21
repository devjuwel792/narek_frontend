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
      query: ({ product_group_id }) => ({
        url: "/products.json?",
        params: product_group_id
          ? { q: `productgroup_id:` + product_group_id }
          : {},

        headers: {
          "X-SESSION-KEY": import.meta.env.VITE_ONFACT_API_KEY,
        },
      }),
    }),
  }),
});

export const { useGetProductGroupsQuery, useGetProductsQuery } = productApi;
