import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../styles/auth.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ ...form, role: "admin" }); // Pass role for backend filtering
      if (res.user && res.user.role === "admin") {
        setUser(res.user, res.token);
        alert("Admin login successful");
        navigate("/admin-dashboard");
      } else {
        alert("You are not authorized as admin");
      }
    } catch (err) {
      console.error(err);
      alert("Admin login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          Admin Page <span className="brand">CleanStreet</span>
        </h2>
        <p>Enter admin credentials to access the dashboard</p>
        <form onSubmit={handleSubmit}>
          <label>Admin Email</label>
          <input name="email" placeholder="Enter admin email" value={form.email} onChange={handleChange} />
          <label>Password</label>
          <input name="password" type="password" placeholder="Enter admin password" value={form.password} onChange={handleChange} />
          <button type="submit">Login as Admin</button>
        </form>
        <p> <span className="link" onClick={() => navigate("/forgot-password")}>Forgot password?</span></p>
        <p>
          Not an admin? <span className="link" onClick={() => navigate("/login")}>User Login</span>
        </p>
      </div>
    </div>
  );
}
