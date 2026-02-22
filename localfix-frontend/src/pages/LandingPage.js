import React from "react";
import "./LandingPage.css";

function LandingPage({ goToLogin, goToSignup }) {
  return (
    <div className="landing">
      <div className="overlay">
        <h1>LocalFix</h1>
        <p>Empowering citizens to report, track, and resolve local problems</p>

        <div className="buttons">
          <button onClick={goToLogin}>Login</button>
          <button className="signup" onClick={goToSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
