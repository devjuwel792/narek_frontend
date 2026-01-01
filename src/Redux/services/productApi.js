import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api5.onfact.be/v1",
    headers: {
      "X-SESSION-KEY":
        "d#lj222iowwdhd#bgpukaimoflf#e113&ybonkvlkamoe2cusoqamkkd%4vb!5p!",
    },
  }),
  endpoints: (builder) => ({
    getProductGroups: builder.query({
      query: () => ({
        url: "/product-groups.json",
      }),
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}.json`,
    }),
    getProducts: builder.query({
      query: ({ product_group_id, productName, limit = 100, offset = 0 }) => ({
        url: "/products.json?",
        params: {
          q: `${
            product_group_id
              ? `productgroup_id:${product_group_id} ${
                  product_group_id && productName && " AND "
                } `
              : ""
          }${productName ? `name:*${productName}*` : ""}`.trim(),
          limit,
          offset,
        },
      }),
    }),
    getProductsByIds: builder.query({
      query: (ids) => ({
        url: "/products.json?",
        params: {
          q: ids.map((id) => `id:${id}`).join(" OR "),
        },
      }),
    }),
  }),
});

export const {
  useGetProductGroupsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByIdsQuery,
} = productApi;
