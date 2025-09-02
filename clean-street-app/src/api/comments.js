import api from "./client";

// ✅ Add a comment to a complaint
export const addComment = async (data) => {
  // data = { complaint_id, content }
  const res = await api.post("/comments", data);
  return res.data;
};

// ✅ Get all comments for a complaint
export const getCommentsByComplaint = async (complaintId) => {
  const res = await api.get(`/comments/${complaintId}`);
  return res.data;
};
