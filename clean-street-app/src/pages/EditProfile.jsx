import { useState } from "react";
import "../styles/profile.css";

export default function EditProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="container profile-container">
      <div className="profile-form">
        <h2>Edit Profile</h2>
        <form>
          {Object.keys(form).map((key) => (
            <div key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input name={key} value={form[key]} onChange={handleChange} placeholder={`Enter your ${key}...`} />
            </div>
          ))}
          <button type="submit">Save Changes</button>
          <button type="button" className="cancel">Cancel</button>
        </form>
      </div>
      <div className="profile-info">
        <h3>Account Information</h3>
        <p><b>Demo_username</b></p>
        <p>cleanstreet@gmail.com</p>
        <p>9876543210</p>
        <p>Keep the environment clean</p>
        <p>Flat.no 212, Maruthi Apartments, Near Delhi School, Sanjev Nagar, Hyderabad - 500025</p>
      </div>
    </div>
  );
}
