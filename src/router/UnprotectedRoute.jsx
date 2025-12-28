import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/Redux/features/auth/authSlice";

export default function UnprotectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    // If authenticated, redirect to admin dashboard
    return <Navigate to="/" replace />;
  }

  return children;
}
