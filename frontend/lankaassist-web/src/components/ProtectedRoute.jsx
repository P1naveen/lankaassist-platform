import { Navigate } from "react-router";
import { isAuthenticated } from "../auth/auth";

export default function ProtectedRoute({
  children,
}) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
