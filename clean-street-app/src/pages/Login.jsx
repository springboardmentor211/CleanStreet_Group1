import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      setUser(res.user, res.token);
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
        console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          Login to Clean<span className="brand">Street</span>
        </h2>
        <p>Enter your credential to access your account</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" placeholder="Enter your username/email" value={form.email} onChange={handleChange} />
          <label>Password</label>
          <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
          <button type="submit">Login</button>
        </form>
        <p> <span className="link" onClick={() => navigate("/forgot-password")}>Forgot password?</span></p>
        <p>
          Don’t have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
}
