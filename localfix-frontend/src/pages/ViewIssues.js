import { useEffect, useState } from "react";
import "./ViewIssues.css";

function ViewIssues({ goBack }) {
  const [issues, setIssues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/issues/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch(() => alert("Failed to fetch issues"));
  }, []);

  return (
    <div className="issues-page">
      <h2>My Reported Issues</h2>

      {issues.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No issues reported yet.
        </p>
      )}

      <div className="issues-grid">
        {issues.map((issue) => (
          <div className="issue-card" key={issue._id}>
            
            {/* IMAGE */}
            {issue.image && (
              <img
                src={`http://localhost:5000${issue.image}`}
                alt="Issue"
                className="issue-image"
              />
            )}

            {/* TITLE */}
            <div className="field">
              <span className="label">📌 Issue Title</span>
              <div className="field-box">{issue.title}</div>
            </div>

            {/* DESCRIPTION */}
            <div className="field">
              <span className="label">📝 Description</span>
              <div className="field-box big">{issue.description}</div>
            </div>

            {/* LOCATION */}
            <div className="field">
              <span className="label">📍 Location</span>
              <div className="field-box big">{issue.location}</div>
            </div>

            {/* STATUS DISPLAY ONLY (NO EDIT FOR NORMAL USER) */}
            <div className="status-display">
              <strong>Status:</strong>{" "}
              <span
                className={
                  issue.status === "Resolved"
                    ? "resolved-status"
                    : "pending-status"
                }
              >
                {issue.status}
              </span>
            </div>

          </div>
        ))}
      </div>

      <button className="back-btn" onClick={goBack}>
        ← Back to Home
      </button>
    </div>
  );
}

export default ViewIssues;