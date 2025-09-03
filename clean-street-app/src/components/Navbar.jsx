import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../styles/navbar.css";
import logo from "../assets/logo.png"; // ✅ adjust path if needed


export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Get profile picture from localStorage
  const [profilePic, setProfilePic] = useState(null);
  useEffect(() => {
    setProfilePic(localStorage.getItem("profilePic"));
    // Listen for changes in localStorage from other tabs/windows
    const onStorage = () => setProfilePic(localStorage.getItem("profilePic"));
    window.addEventListener("storage", onStorage);
    // Listen for custom event in this tab
    const onProfilePicChanged = () => setProfilePic(localStorage.getItem("profilePic"));
    window.addEventListener("profilePicChanged", onProfilePicChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profilePicChanged", onProfilePicChanged);
    };
  }, []);

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
          <>
            <Link to="/profile" className="profile-circle-btn" title="Profile">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #3ec6b8", background: "#e0f7fa" }}
                />
              ) : (
                <svg height="32" width="32" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="28" stroke="#3ec6b8" strokeWidth="4" fill="#e0f7fa" />
                  <circle cx="30" cy="24" r="10" fill="#3ec6b8" />
                  <ellipse cx="30" cy="44" rx="14" ry="8" fill="#3ec6b8" />
                </svg>
              )}
            </Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
            <Link to="/profile" className="profile-circle-btn" title="Profile">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid #3ec6b8", background: "#e0f7fa" }}
                />
              ) : (
                <svg height="32" width="32" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="28" stroke="#3ec6b8" strokeWidth="4" fill="#e0f7fa" />
                  <circle cx="30" cy="24" r="10" fill="#3ec6b8" />
                  <ellipse cx="30" cy="44" rx="14" ry="8" fill="#3ec6b8" />
                </svg>
              )}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
