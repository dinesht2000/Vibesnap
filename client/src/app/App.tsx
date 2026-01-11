import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootRedirect from "./RootRedirect";
import ProtectedRouteLayout from "./ProtectedRoute";
import { FullScreenSkeleton } from "../components/skeleton-loader"; 
import { Suspense, lazy } from "react";

const Login = lazy(() => import("../pages/Login"));
const ProfileSetup = lazy(() => import("../pages/ProfileSetup"));
const Feed = lazy(() => import("../pages/Feed"));
const Profile = lazy(() => import("../pages/Profile"));
const CreatePost = lazy(() => import("../pages/CreatePost"));

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
       <Suspense fallback={<FullScreenSkeleton />}>
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
       </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
