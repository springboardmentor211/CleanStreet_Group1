import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../styles/navbar.css";
import logo from "../assets/logo.png";
import defaultProfile from "../assets/profile-icon1.png";

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
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/new-complaint">Report Issue</Link>
            <Link to="/complaints">View Complaints</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <div className="nav-profile">
              <Link to="/edit-profile">
                <img
                  src={
                    user && user._id
                      ? `http://localhost:5000/api/user/profile/photo/${user._id}`
                      : defaultProfile
                  }
                  alt="profile"
                  className="profile-icon"
                  onError={(e) => (e.target.src = defaultProfile)}
                />
              </Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
