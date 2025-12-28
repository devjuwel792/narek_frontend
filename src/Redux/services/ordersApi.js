import {
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react";
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://10.10.13.19:9400/api";
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, {
      getState
    }) => {
      // Get token from auth state
      const token = getState().auth.token;

      // If we have a token, include it in the headers
      if (token) {
        headers.set("authorization", `Token ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/orders/",
      }),
    }),
    getProfile: builder.query({
      query: () => '/customer/',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/customer/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation
} = ordersApi;