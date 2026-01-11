import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FullScreenSkeleton } from "../components/skeleton-loader";


export default function RootRedirect() {
  const { user, loading, profileComplete } = useAuth();

  if (loading || (user && profileComplete === null)) {
    return <FullScreenSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (profileComplete === true) {
    return <Navigate to="/feed" replace />;
  }

  return <Navigate to="/login" replace />;
}

