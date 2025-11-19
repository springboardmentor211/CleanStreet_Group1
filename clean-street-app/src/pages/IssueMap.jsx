import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../api/client";
import "../styles/issueMap.css";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function IssueMap() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api
      .get("/complaints")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error fetching complaints:", err));
  }, []);

  return (
    <div className="issue-map-container">
      <h2>Complaint Map 🗺️</h2>
      <MapContainer
        center={[20.5937, 78.9629]} // Center on India by default
        zoom={5}
        style={{ height: "500px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {complaints.map(
          (c) =>
            c.location_coords?.lat &&
            c.location_coords?.lng && (
              <Marker
                key={c._id}
                position={[c.location_coords.lat, c.location_coords.lng]}
              >
                <Popup>
                  <b>{c.title}</b> <br />
                  {c.address}, {c.city} <br />
                  Status: {c.status} <br />
                  👍 {c.upvotes || 0} | 👎 {c.downvotes || 0}
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}
