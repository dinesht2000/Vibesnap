import { useAuth } from "../hooks/useAuth";
import { useNavigate,Navigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useQueries";



export default function Feed() {
 const { user, profileComplete, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const { data: profile, isLoading: loading } = useUserProfile(
    user?.uid,
    !!(user && profileComplete === true)
  );
 

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!authLoading && user && profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-800 pb-20">
      {/* Main Content Container */}
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {/* Welcome Section */}
        <div className="px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(`/profile/${user?.uid}`)}
            className="flex items-center gap-4 mb-6 hover:opacity-80 transition-opacity w-full text-left"
          >
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-xl font-medium">
                  {profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-sm">Welcome Back,</p>
              <p className="text-black text-xl font-bold">{profile?.name || user?.email}</p>
            </div>
          </button>
          <h1 className="text-2xl font-bold text-black">Feeds</h1>
        </div>
      </div>


      <button
        onClick={() => navigate("/create-post")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-900 transition-colors z-50"
        aria-label="Create new post"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
      
  );
};


