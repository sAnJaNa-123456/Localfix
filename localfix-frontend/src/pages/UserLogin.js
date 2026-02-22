import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "./UserLogin.css";

function UserLogin({ onSuccess, goToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Normal Login
  const loginUser = async (e) => {
  e.preventDefault();
  setError("");

  if (!username || !password) {
    setError("Please enter username and password");
    return;
  }

  /* ==========================
     ✅ HARDCODED ADMIN LOGIN
  ========================== */
  if (username === "admin" && password === "admin123") {
    const adminUser = {
      username: "admin",
      role: "admin"
    };

    localStorage.setItem("user", JSON.stringify(adminUser));
    onSuccess(adminUser);
    return;
  }

  /* ==========================
     NORMAL USER LOGIN
  ========================== */
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    onSuccess(data.user);

  } catch {
    setError("Server error. Try again.");
  }
};

  // ✅ Google Login
  const loginWithGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const googleUser = {
        id: user.uid,
        username: user.displayName,
        email: user.email,
      };

      localStorage.setItem("user", JSON.stringify(googleUser));
      onSuccess(googleUser);

    } catch (err) {
      console.error(err);
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p className="subtext">Login to continue to LocalFix.</p>

        {/* ✅ FORM WRAPPER (prevents autofill issues) */}
        <form autoComplete="off" onSubmit={loginUser}>
          
          <input
            type="text"
            name="username"
            autoComplete="new-username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={loginWithGoogle}>
          Continue with Google
        </button>

        <div className="signup-text">
          Not a user?{" "}
          <span onClick={goToSignup} className="signup-link">
            Signup
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;