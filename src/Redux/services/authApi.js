import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get base URL from environment variable or use default
const BASE_URL = import.meta.env.VITE_API_URL || "http://10.10.13.16:8000/api";

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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    // signup: builder.mutation({
    //   query: (userData) => ({
    //     url: "/auth/signup",
    //     method: "POST",
    //     body: userData,
    //   }),
    // }),
    // logout: builder.mutation({
    //   query: () => ({
    //     url: "/auth/logout",
    //     method: "POST",
    //   }),
    // }),
    // forgotPassword: builder.mutation({
    //   query: (email) => ({
    //     url: "/auth/forgot-password",
    //     method: "POST",
    //     body: { email },
    //   }),
    // }),
    // verifyOtp: builder.mutation({
    //   query: (data) => ({
    //     url: "/auth/verify-otp",
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password/change/",
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => "/auth/me/",
      providesTags: ["User"],
    }),
    updateCurrentUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/me/",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    // refreshToken: builder.mutation({
    //   query: () => ({
    //     url: "/auth/refresh-token",
    //     method: "POST",
    //   }),
    // }),
  }),
});

export const {
  useLoginMutation,
  // useSignupMutation,
  // useLogoutMutation,
  // useForgotPasswordMutation,
  // useVerifyOtpMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  // useRefreshTokenMutation,
} = authApi;
