import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get base URL from environment variable or use default
const BASE_URL = import.meta.env.VITE_API_URL || "https://clashingly-nonlicensable-tennille.ngrok-free.dev/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;

      // If we have a token, include it in the headers
      if (token) {
        headers.set("authorization", `Token ${token}`);
         headers.set("ngrok-skip-browser-warning", "true"); 
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
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/token/login/',
        method: 'POST',
        body,
      }),
    }),
    addToFavorites: builder.mutation({
      query: (body) => ({
        url: '/favorites/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Favorites'],
    }),
    getFavorites: builder.query({
      query: () => '/favorites/',
      providesTags: ['Favorites'],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginMutation, useAddToFavoritesMutation, useGetFavoritesQuery } = authApi;
