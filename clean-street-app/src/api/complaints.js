import api from "./client";

// ✅ Create new complaint
export const createComplaint = async (data) => {
  const res = await api.post("/complaints", data);
  return res.data;
};

// ✅ Get all complaints
export const getComplaints = async () => {
  const res = await api.get("/complaints");
  return res.data;
};

// ✅ Get complaint by ID
export const getComplaintById = async (id) => {
  const res = await api.get(`/complaints/${id}`);
  return res.data;
};

// ✅ Update complaint status (admin/volunteer)
export const updateComplaintStatus = async (id, status) => {
  const res = await api.patch(`/complaints/${id}/status`, { status });
  return res.data;
};
