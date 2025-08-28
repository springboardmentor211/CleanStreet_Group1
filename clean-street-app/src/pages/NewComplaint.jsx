import { useState } from "react";
// import api from "../api/client";
import "../styles/complaint.css";
import { createComplaint } from "../api/complaints";

export default function NewComplaint() {
  const [form, setForm] = useState({
    title: "",
    type: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    priority: "",
    description: "",
    phone: "",
    landmark: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComplaint ({ title: form.title, description: form.description, address: form.address });
      alert("Complaint submitted!");
    } catch (err) {
      alert("Failed to submit");
    }
  };

  return (
    <div className="container complaint-form">
      <h2>Complaint Submission Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Issue Title</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Enter issue title" />
        <label>Issue Type</label>
        <input name="type" value={form.type} onChange={handleChange} placeholder="Enter issue type" />
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Enter address" />
        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} placeholder="Enter city" />
        <label>State</label>
        <input name="state" value={form.state} onChange={handleChange} placeholder="Enter state" />
        <label>Pincode</label>
        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Enter pincode" />
        <label>Priority Level</label>
        <input name="priority" value={form.priority} onChange={handleChange} placeholder="Enter priority level" />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter description" />
        <label>Phone Number</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" />
        <label>Nearby Landmark</label>
        <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Enter landmark" />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}
