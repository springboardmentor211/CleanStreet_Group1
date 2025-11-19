// frontend/api/admin.js

const API_BASE_URL = "http://localhost:5000/api/admin"; 
// 👆 change 5000 to your backend port

/**
 * Get admin metrics (total, resolved, inReview, received complaints)
 */
export async function getAdminMetrics(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // if using auth middleware
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching admin metrics:", err);
    throw err;
  }
}
