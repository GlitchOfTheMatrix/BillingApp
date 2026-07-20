import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../../app/router/routes";
import { useAuth } from "../../features/auth/hooks/useAuth";
import AuthLoader from "../../features/auth/components/AuthLoader/AuthLoader";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
