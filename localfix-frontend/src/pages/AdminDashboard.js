import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./AdminDashboard.css";

const API_BASE = "https://localfix-kwvf.onrender.com";

function AdminDashboard({ goBack }) {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/issues`)
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.log(err));
  }, []);

  const updateStatus = async (id, newStatus) => {
    const res = await fetch(
      `${API_BASE}/issues/${id}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const updatedIssue = await res.json();

    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === id ? updatedIssue : issue
      )
    );
  };

  const deleteIssue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue?"
    );
    if (!confirmDelete) return;

    await fetch(`${API_BASE}/issues/${id}`, {
      method: "DELETE",
    });

    setIssues((prev) =>
      prev.filter((issue) => issue._id !== id)
    );
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="admin-back-btn" onClick={goBack}>
          ← Back to Home
        </button>
      </div>

      <h3 className="admin-subtitle">All Reported Issues</h3>

      <div className="admin-issues">
        {issues.map((issue) => (
          <div key={issue._id} className="admin-card">
            <h4>{issue.title}</h4>
            <p>{issue.description}</p>

            {issue.image && (
              <img
                src={`${API_BASE}${issue.image}`}
                alt="Issue"
                className="admin-image"
              />
            )}

            <p><strong>Location:</strong> {issue.location}</p>

            {issue.latitude && issue.longitude && (
              <div className="admin-map">
                <MapContainer
                  center={[issue.latitude, issue.longitude]}
                  zoom={14}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[issue.latitude, issue.longitude]}>
                    <Popup>Issue Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            <div className="status-section">
              <strong>Status:</strong>
              <select
                value={issue.status}
                onChange={(e) =>
                  updateStatus(issue._id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <p><strong>Reported By:</strong> {issue.username}</p>

            <button
              className="delete-btn"
              onClick={() => deleteIssue(issue._id)}
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;