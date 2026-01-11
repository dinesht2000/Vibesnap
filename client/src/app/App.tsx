import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "../pages/Login";
import ProfileSetup from "../pages/ProfileSetup";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import RootRedirect from "./RootRedirect";
import CreatePost from "../pages/CreatePost";
import ProtectedRouteLayout from "./ProtectedRoute";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          //public routes
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RootRedirect />} />

          //private routes
          <Route element={<ProtectedRouteLayout />}>
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/profile/:userId?" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
