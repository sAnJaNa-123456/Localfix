import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import ViewIssues from "./pages/ViewIssues";
import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import LandingPage from "./pages/LandingPage";

import "./App.css";

function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  /* ======================
     RESTORE USER ON REFRESH
  ====================== */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setPage("home");
    }
  }, []);

  /* ======================
     LOGOUT
  ====================== */
  const logoutUser = () => {
    localStorage.removeItem("user");
    setUser(null);
    setPage("landing");
  };

  /* ======================
     HANDLE LOGIN SUCCESS
  ====================== */
  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setPage("home");
  };

  /* ======================
     LANDING PAGE
  ====================== */
  if (!user && page === "landing") {
    return (
      <LandingPage
        goToLogin={() => setPage("login")}
        goToSignup={() => setPage("signup")}
      />
    );
  }

  /* ======================
     LOGIN / SIGNUP
  ====================== */
  if (!user) {
    return (
      <>
        {page === "login" && (
          <UserLogin
            onSuccess={handleLoginSuccess}
            goToSignup={() => setPage("signup")}
            goBack={() => setPage("landing")}
          />
        )}

        {page === "signup" && (
          <UserSignup
            onSuccess={() => setPage("login")}
            goBack={() => setPage("landing")}
          />
        )}
      </>
    );
  }

  /* ======================
     MAIN APP
  ====================== */
  return (
    <>
      <Navbar
        username={user.username}
        onLogout={logoutUser}
      />

      {/* HOME */}
      {page === "home" && (
        <Home
          goToReport={() => setPage("report")}
          goToView={() => setPage("view")}
          goToAdmin={() => setPage("admin")}
          isAdmin={user?.role === "admin"}
        />
      )}

      {/* REPORT */}
      {page === "report" && (
        <ReportIssue
          goBack={() => setPage("home")}
        />
      )}

      {/* VIEW */}
      {page === "view" && (
        <ViewIssues
          goBack={() => setPage("home")}
        />
      )}

      {/* ADMIN DASHBOARD */}
      {page === "admin" && user?.role === "admin" && (
        <AdminDashboard
          goBack={() => setPage("home")}
        />
      )}
    </>
  );
}

export default App;