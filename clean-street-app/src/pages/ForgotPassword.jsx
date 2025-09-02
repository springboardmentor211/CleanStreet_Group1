import { useState } from "react";
import api from "../api/client";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      alert("Password reset link sent to your email");
    } catch (err) {
      alert("Error sending reset email");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
          <p>
          Don’t have an account?{" "}
          <span className="link" >Register here</span>
        </p>
        </form>
      </div>
    </div>
  );
}
