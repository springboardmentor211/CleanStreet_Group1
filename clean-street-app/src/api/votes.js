import api from "./client";

export const voteComplaint = async ({ complaint_id, vote_type }) => {
  try {
    const res = await api.post("/votes", { complaint_id, vote_type });
    return res.data;
  } catch (err) {
    console.error("Error voting complaint:", err);
    throw err;
  }
};
