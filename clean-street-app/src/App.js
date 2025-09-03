
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import ViewComplaints from "./pages/ViewComplaints";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
<<<<<<< Updated upstream
import LandingPage from "./pages/Landing"
=======
import HomePage from "./pages/HomePage";

>>>>>>> Stashed changes

function AppLayout() {
  const location = useLocation();

  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
<<<<<<< Updated upstream
        <Route path="/" element={<LandingPage />} />
=======
        <Route path="/" element={<HomePage />} />
>>>>>>> Stashed changes
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/new-complaint" element={<NewComplaint />} />
        <Route path="/complaints" element={<ViewComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
