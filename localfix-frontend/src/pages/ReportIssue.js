import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./ReportIssue.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function ReportIssue({ goBack }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= USE GPS ================= */
  const useGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);
      setLocation(`${lat}, ${lng}`);
    });
  };

  /* ================= SUBMIT ISSUE ================= */
  const submitIssue = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("❌ You must be logged in.");
      return;
    }

    if (!title || !description || !location) {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("userId", user.id);
      formData.append("username", user.username);

      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:5000/issues", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit");

      // Show success message
      setMessage("✅ Issue reported successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setLatitude(null);
      setLongitude(null);
      setImage(null);

      // 🔥 Go back after 1 second
      setTimeout(() => {
        goBack();
      }, 1000);

    } catch (err) {
      setMessage("❌ Error submitting issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-box">

        <div className="report-header">
          <h2>Report an Issue</h2>
        </div>

        <form onSubmit={submitIssue}>

          <input
            type="text"
            placeholder="Issue Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Describe the issue *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="location-group">
            <input
              type="text"
              value={location}
              placeholder="Location (Use GPS) *"
              readOnly
            />
            <button
              type="button"
              onClick={useGPS}
              className="gps-btn"
            >
              Use GPS
            </button>
          </div>

          {/* MAP PREVIEW */}
          {latitude && longitude && (
            <div className="map-preview">
              <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                  <Popup>Issue Location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {message && <p className="message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;