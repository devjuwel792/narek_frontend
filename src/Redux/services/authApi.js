import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL ;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {

      const token = getState().auth.token;
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
      invalidatesTags: ['Profile']
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
    setPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/users/set_password/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useRegisterUserMutation, useLoginMutation, useAddToFavoritesMutation, useGetFavoritesQuery, useSetPasswordMutation } = authApi;
