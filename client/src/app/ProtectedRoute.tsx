import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FullScreenSkeleton } from "../components/skeleton-loader";


export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet/>;
}

