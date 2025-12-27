import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get base URL from environment variable or use default
const BASE_URL = import.meta.env.VITE_API_URL || "http://10.10.13.19:9400/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;

      // If we have a token, include it in the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: '/register/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = authApi;
