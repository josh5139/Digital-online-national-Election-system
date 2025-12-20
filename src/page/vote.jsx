import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Vote() {
  const { ballotId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await API.get(`/ballots/${ballotId}/candidates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidates(res.data);
      } catch (err) {
        setMessage("Failed to load candidates. Try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [ballotId, navigate]);

  // Handle voting
  const handleVote = async (candidateId) => {
    if (!window.confirm("Are you sure you want to cast your vote? This action cannot be undone.")) return;

    try {
      setVoting(true);
      const token = localStorage.getItem("token");
      await API.post(
        `/ballots/${ballotId}/vote`,
        { candidateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Your vote has been submitted successfully!");
      // Optionally, refresh the candidate list to disable the voted candidate
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, alreadyVoted: true } : c))
      );

      setTimeout(() => navigate("/ballots"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to submit vote. Try again.");
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading candidates...</p>;
  if (!candidates.length)
    return <p className="text-center mt-10 text-gray-500">No candidates found for this ballot.</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Cast Your Vote</h1>

      {message && (
        <p
          className={`text-center mb-4 p-2 rounded ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
        >
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-xl shadow flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-xl font-semibold">{c.name}</h3>
              <p className="text-gray-500 mt-1">{c.party}</p>
            </div>

            <button
              onClick={() => handleVote(c.id)}
              disabled={voting || c.alreadyVoted}
              className={`mt-4 px-4 py-2 rounded-lg text-white transition ${c.alreadyVoted || voting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {c.alreadyVoted ? "Already Voted" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
