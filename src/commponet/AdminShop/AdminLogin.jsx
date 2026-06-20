import { useState } from "react";
import "./admin.css";   // lowercase


export default function AdminLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.29.2:7210/api/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Login successful");

        // Get username from API response if available
        const usernameFromAPI = data.user?.name || data.name;

        // If API didn't return name, use stored signup name or fallback to email
        const storedSignupName = localStorage.getItem("username");
        const finalUsername = usernameFromAPI || storedSignupName || email;

        // Save user info
        localStorage.setItem("token", data.token || "YOUR_FIXED_TOKEN_HERE");
        localStorage.setItem("username", finalUsername);

        setPage("admin-dashboard"); // redirect
      } else {
        setMessage(data.message || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠ Something went wrong. Try again.");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button
          className="auth-back-btn"
          onClick={() => setPage("home")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18 }}>&larr;</span> Back
        </button>

        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back! Please login to continue.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login full">
            Login
          </button>
        </form>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}

        {/* ✅ Google login */}
        <button className="btn-google">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span className="link" onClick={() => setPage("admin-signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
