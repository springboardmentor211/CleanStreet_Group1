import { addComment, getCommentsByComplaint } from "../api/comments";
import { useEffect, useState } from "react";

export default function Comments({ complaintId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getCommentsByComplaint(complaintId).then(setComments);
  }, [complaintId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addComment({ complaint_id: complaintId, content: text });
    setText("");
    setComments(await getCommentsByComplaint(complaintId));
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((c) => (
        <p key={c._id}><b>{c.user_id?.name || "User"}:</b> {c.content}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
