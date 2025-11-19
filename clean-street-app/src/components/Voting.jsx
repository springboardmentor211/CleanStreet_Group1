import { voteComplaint } from "../api/votes";

export default function VoteButtons({ complaintId }) {
  const handleVote = async (type) => {
    await voteComplaint({ complaint_id: complaintId, vote_type: type });
    alert(`You ${type}d this complaint`);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => handleVote("upvote")}>👍 Upvote</button>
      <button onClick={() => handleVote("downvote")} style={{ marginLeft: "10px" }}>👎 Downvote</button>
    </div>
  );
}
