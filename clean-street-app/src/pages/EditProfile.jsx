import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "../styles/profile.css";
import  "../assets/profile-icon.png";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Handle text input
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ✅ Save profile text fields
  const handleSave = async () => {
    try {
      const res = await api.put("/user/profile", profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProfile(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  // ✅ Handle photo upload
  const handlePhotoUpload = async () => {
    if (!photoFile) return alert("Please select a file");
    const formData = new FormData();
    formData.append("photo", photoFile);

    try {
      const res = await api.post("/user/profile/photo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setProfile(res.data);
      alert("Profile photo updated!");
    } catch (err) {
      alert("Error uploading photo");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div className="profile-main-container">
      <div className="profile-left">
        <h2>Edit Profile</h2>
        <form className="profile-form-view" autoComplete="off">
          <label>Username</label>
          <input name="name" value={profile.name || ""} onChange={handleChange} />

          <label>Email</label>
          <input name="email" value={profile.email || ""} disabled />

          <label>Phone</label>
          <input name="phone" value={profile.phone || ""} onChange={handleChange} />

          <label>Bio</label>
          <input name="bio" value={profile.bio || ""} onChange={handleChange} />

          <label>Address Line 1</label>
          <input name="addressLine1" value={profile.addressLine1 || ""} onChange={handleChange} />

          <label>Address Line 2</label>
          <input name="addressLine2" value={profile.addressLine2 || ""} onChange={handleChange} />

          <label>State</label>
          <input name="state" value={profile.state || ""} onChange={handleChange} />

          <label>District</label>
          <input name="district" value={profile.district || ""} onChange={handleChange} />

          <label>Pincode</label>
          <input name="pincode" value={profile.pincode || ""} onChange={handleChange} />

          <div className="profile-btn-row">
            <button type="button" className="profile-btn cancel" onClick={() => navigate("/dashboard")}>Cancel</button>
            <button type="button" className="profile-btn save" onClick={handleSave}>Save Changes</button>
          </div>
        </form>
      </div>

      <div className="profile-right">
        <div className="profile-avatar-large">
          <img
  src={
    profile.profilePhoto
      ? `http://localhost:5000/api/user/profile/photo/${profile._id}`
      : "/profile-icon.png"
  }
  alt="Profile"
  style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
/>

        </div>

        <div style={{ marginTop: 20 }}>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
          <button type="button" onClick={handlePhotoUpload}>Upload Photo</button>
        </div>
      </div>
    </div>
  );
}
