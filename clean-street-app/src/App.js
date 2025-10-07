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
import LandingPage from "./pages/Landing"
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import IssueMap from "./pages/IssueMap";
import AdminReports from "./pages/AdminReports";

function AppLayout() {
  const location = useLocation();

  const hideNavbar = ["/login", "/register", "/admin-login"].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/new-complaint" element={<NewComplaint />} />
        <Route path="/complaints" element={<ViewComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/map" element={<IssueMap />} />
  <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
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
