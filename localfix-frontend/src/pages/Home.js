import "../App.css";

function Home({ goToReport, goToView, goToAdmin, isAdmin }) {
  return (
    <div className="home-wrapper">

      {/* Hero Section */}
      <section className="hero-section">
        <h1>LocalFix – Public Grievance Portal</h1>


        <div className="home-buttons">
          <button className="report-btn" onClick={goToReport}>
            🚨 Report Issue
          </button>

          <button className="view-btn" onClick={goToView}>
            📋 View Issues
          </button>

          {isAdmin && (
            <button className="admin-btn" onClick={goToAdmin}>
              🛠 Admin Dashboard
            </button>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="service-card">
          <h3>📢 Lodge Complaint</h3>
          <p>
            Submit complaints related to roads, sanitation, drainage,
            electricity, and other public services.
          </p>
        </div>

        <div className="service-card">
          <h3>📍 Track Status</h3>
          <p>
            Monitor the real-time progress of your reported issues
            with transparency and accountability.
          </p>
        </div>

        <div className="service-card">
          <h3>📊 Public Dashboard</h3>
          <p>
            View all reported issues and their resolution status
            to ensure public transparency.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 LocalFix – Digital Public Grievance Redressal System</p>
        <p>Developed for Smart City Civic Services</p>
      </footer>

    </div>
  );
}

export default Home;