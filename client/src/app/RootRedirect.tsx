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

  // If profile is not complete, redirect to profile setup
  if (profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }

  // If profile is complete, redirect to feed
  if (profileComplete === true) {
    return <Navigate to="/feed" replace />;
  }

  // Fallback (shouldn't reach here)
  return <Navigate to="/login" replace />;
}

