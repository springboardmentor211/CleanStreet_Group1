import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComplaintById } from "../api/complaints";
import { getCommentsByComplaint, addComment } from "../api/comments";
import { voteComplaint } from "../api/votes";
import api from "../api/client";
import "../styles/complaintDetail.css";

export default function ComplaintDetail() {
  const { id } = useParams(); // complaintId from URL
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Load complaint + comments
  useEffect(() => {
    api.get(`/complaints/${id}`)
      .then(res => setComplaint(res.data))
      .catch(err => console.error("Error loading complaint:", err));

    getComplaintById(id).then(setComplaint);
    getCommentsByComplaint(id).then(setComments);
  }, [id]);

  const handleVote = async (type) => {
    await voteComplaint({ complaint_id: id, vote_type: type });
    alert(`You ${type}d this complaint`);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    await addComment({ complaint_id: id, content: newComment });
    setNewComment("");
    setComments(await getCommentsByComplaint(id));
  };

  if (!complaint) return <p>Loading...</p>;

  return (
    <div className="container complaint-detail">
      <h2>{complaint.title}</h2>
      <p><b>Status:</b> {complaint.status}</p>
      <p><b>Type:</b> {complaint.type}</p>
      <p><b>Priority:</b> {complaint.priority}</p>
      <p><b>Description:</b> {complaint.description}</p>
      <p><b>Address:</b> {complaint.address}, {complaint.city}, {complaint.state} - {complaint.pincode}</p>
      <p><b>Phone:</b> {complaint.phone}</p>
      <p><b>Landmark:</b> {complaint.landmark}</p>

      {/* Map */}
      {complaint.location_coords && (
        <iframe
          title="map"
          width="100%"
          height="250"
          style={{ marginTop: "10px", borderRadius: "8px" }}
          src={`https://www.google.com/maps?q=${complaint.location_coords.lat},${complaint.location_coords.lng}&z=15&output=embed`}
        />
      )}

      {/* Multiple Photos */}
      <h3>Photos</h3>
      <div className="complaint-photos">
        {Array.isArray(complaint.photos) && complaint.photos.length > 0 ? (
          complaint.photos.map((_, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000/api/complaints/${complaint._id}/photo/${idx}`}
              alt={`Complaint ${idx}`}
              className="complaint-photo"
            />
          ))
        ) : (
          <p>No photos uploaded</p>
        )}
      </div>

      {/* Voting Section */}
      <div className="vote-buttons">
        <button onClick={() => handleVote("upvote")}>👍 Upvote</button>
        <button onClick={() => handleVote("downvote")}>👎 Downvote</button>
      </div>

      {/* Comments Section */}
      <div className="comments">
        <h3>Comments</h3>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <p key={c._id}>
            <b>{c.user_id?.name || "User"}:</b> {c.content}
          </p>
        ))}

        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
}
