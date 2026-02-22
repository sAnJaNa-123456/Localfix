import "./Navbar.css";

function Navbar({ username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">LocalFix</span>
      </div>

      <div className="navbar-right">
        <span className="username">👤 {username}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
