import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../../firebase/database";
import type { User } from "firebase/auth";

interface WelcomeSectionProps {
  user: User | null;
  profile: UserProfile | null;
  onLogout: () => void;
}

export default function WelcomeSection({
  user,
  profile,
  onLogout,
}: WelcomeSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="px-6 pt-8 pb-6">
      <div className="flex items-start justify-between mb-6">
        <button
          onClick={() => navigate(`/profile/${user?.uid}`)}
          className="flex items-center gap-4 hover:opacity-80 transition-opacity text-left"
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
        <button
          onClick={onLogout}
          className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          aria-label="Logout"
          title="Logout"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
      <h1 className="text-2xl font-bold text-black">Feeds</h1>
    </div>
  );
}

