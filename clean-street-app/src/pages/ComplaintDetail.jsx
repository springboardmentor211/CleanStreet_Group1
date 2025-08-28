import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComplaintById } from "../api/complaints";
import { getCommentsByComplaint, addComment } from "../api/comments";
import { voteComplaint } from "../api/votes";
import "../styles/complaintDetail.css";

export default function ComplaintDetail() {
  const { id } = useParams(); // complaintId from URL
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Load complaint + comments
  useEffect(() => {
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
      <p>{complaint.description}</p>
      <p><b>Status:</b> {complaint.status}</p>
      <p><b>Address:</b> {complaint.address}</p>
      {complaint.photo && <img src={complaint.photo} alt="Complaint" className="complaint-img" />}

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
