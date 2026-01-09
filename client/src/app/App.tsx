import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "../pages/Login";
import ProfileSetup from "../pages/ProfileSetup";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import RootRedirect from "./RootRedirect";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile/:userId?" element={<Profile />} />
        <Route path="/" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
