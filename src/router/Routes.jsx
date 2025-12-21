import Login from "@/Admin/Auth/Login";
import App from "@/App";

import SignUp from "@/Admin/Auth/SignUp";
import { Layout } from "@/layouts/Layout";
import { LoginLayout } from "@/layouts/LoginLayout";
import EditProfilePage from "@/pages/EditProfilePage";
import FavoritesPage from "@/pages/FavoritesPage";
import OrderPage from "@/pages/OrderPage";
import ProfilePage from "@/pages/ProfilePage";
import UnprotectedRoute from "@/router/UnprotectedRoute";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <ProtectedRoute>
      <Layout />
      // </ProtectedRoute>
    ),
    errorElement: <h2>Route not found</h2>,
    children: [
      {
        index: true,
        // element: <Navigate to="/auth/login" replace />,
        element: <App />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
      {
        path: "/account",
        element: <ProfilePage />,
      },
      {
        path: "/edit-profile",
        element: <EditProfilePage />,
      },
      {
        path: "/favorites",
        element: <FavoritesPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <UnprotectedRoute>
        <LoginLayout />
      </UnprotectedRoute>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
    ],
  },
]);

export default router;
