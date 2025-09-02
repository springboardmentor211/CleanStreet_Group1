import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        location: "Aurangabad" // can extend later
      });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          Register to Clean<span className="brand">Street</span>
        </h2>
        <p>Create your account to start reporting on civic issues</p>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="name" placeholder="Enter your name" value={form.name} onChange={handleChange} />
          <label>Username</label>
          <input name="username" placeholder="Enter your username" value={form.username} onChange={handleChange} />
          <label>Email</label>
          <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} />
          <label>Phone Number (Optional)</label>
          <input name="phone" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} />
          <label>Password</label>
          <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
