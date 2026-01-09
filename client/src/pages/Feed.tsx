import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Logout
      </button>
    </div>
  );
};

export default Feed;
