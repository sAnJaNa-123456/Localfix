import { useState } from "react";
import "./UserSignup.css";

function UserSignup({ onSuccess, goBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault(); // prevent page refresh
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        onSuccess();
      }, 1200);

    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p className="subtext">Sign up to start reporting issues.</p>

        {/* ✅ Form wrapper prevents autofill */}
        <form autoComplete="off" onSubmit={handleSignup}>
          
          <input
            type="text"
            name="username"
            autoComplete="new-username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="primary-btn">
            Sign Up
          </button>
        </form>

        <button className="secondary-btn" onClick={goBack}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default UserSignup;