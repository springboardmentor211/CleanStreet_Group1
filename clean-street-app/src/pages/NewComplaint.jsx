import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import api from "../api/client";
import "../styles/complaint.css";

// Fix marker icon (Leaflet bug in React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to capture click
function LocationMarker({ setFormData }) {
  useMapEvents({
    click(e) {
      setFormData((prev) => ({
        ...prev,
        location: { lat: e.latlng.lat, lng: e.latlng.lng },
      }));
    },
  });
  return null;
}

export default function NewComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    priority: "",
    description: "",
    phone: "",
    landmark: "",
    location: { lat: null, lng: null },
  });

  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Get current location
  // const handleGetLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         setFormData((prev) => ({
  //           ...prev,
  //           location: {
  //             lat: pos.coords.latitude,
  //             lng: pos.coords.longitude,
  //           },
  //         }));
  //       },
  //       (err) => {
  //         alert("Location access denied!");
  //         console.error(err);
  //       }
  //     );
  //   } else {
  //     alert("Geolocation not supported by your browser.");
  //   }
  // };

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };
  // Submit complaint
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      // Normal text fields
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== "location") {
          data.append(key, val);
        }
      });

      // ✅ Append location properly
      if (formData.location.lat && formData.location.lng) {
        data.append("location_coords", JSON.stringify(formData.location));
      }

      // ✅ Append all photos
      photos.forEach((file) => {
        data.append("photos", file); // key name "photos" (plural)
      });

      await api.post("/complaints", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Complaint submitted successfully!");

      // Reset form
      setFormData({
        title: "",
        type: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        priority: "",
        description: "",
        phone: "",
        landmark: "",
        location: { lat: null, lng: null },
      });
      setPhotos([]);
      setPhotoPreviews([]);
    } catch (err) {
      console.error("Error submitting complaint:", err.response || err);
      alert("Failed to submit complaint");
    }
  };

  return (
    <div className="complaint-container">
      <h2>Complaint submission form</h2>
      <h3 className="complaint-title">Report a Civic Issue</h3>

      <div className="complaint-form">
        {/* Left Column */}
        <div className="complaint-left">
          <label>Issue Title</label>
          <input name="title" value={formData.title} onChange={handleChange} />

          <label>Issue Type</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Pothole">Pothole</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Supply">Water Supply</option>
          </select>

          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <label>City</label>
          <input name="city" value={formData.city} onChange={handleChange} />

          <label>State</label>
          <input name="state" value={formData.state} onChange={handleChange} />

          <label>Pincode</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          <label>Priority Level</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Right Column */}
        <div className="complaint-right">
          <div className="map-section">
            <label>Location on Map 📍</label>
            <MapContainer
              center={[20.5937, 78.9629]} // India center
              zoom={5}
              style={{ height: "250px", borderRadius: "8px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {formData.location.lat && (
                <Marker
                  position={[formData.location.lat, formData.location.lng]}
                />
              )}
              <LocationMarker setFormData={setFormData} />
            </MapContainer>
          </div>

          <label>Phone number 📞</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />

          <label>Nearby Landmark</label>
          <input
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
          />

          <label>Upload Photo/Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
          />

          {/* ✅ Show preview */}
          {photoPreviews.length > 0 && (
            <div className="photo-preview">
              {photoPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    margin: "5px",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="complaint-btns">
        <button className="cancel-btn">Cancel</button>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Report
        </button>
      </div>
    </div>
  );
}
