import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../styles/navbar.css";
import logo from "../assets/logo.png"; // ✅ adjust path if needed

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <img src={logo} alt="CleanStreet Logo" className="navbar-logo" />
        {/* <span className="navbar-title">CleanStreet</span> */}
      </div>

      <div className="navbar-links">
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
