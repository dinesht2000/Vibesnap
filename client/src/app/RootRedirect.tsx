import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RootRedirect() {
  const { user, loading, profileComplete } = useAuth();

  if (loading || (user && profileComplete === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
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

