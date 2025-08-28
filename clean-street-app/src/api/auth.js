import api from "./client";

// ✅ Register a new user
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// ✅ Login user
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data; // { token, user }
};

// ✅ Get current user (optional, if backend supports)
export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};
