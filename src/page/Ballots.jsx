import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Ballots() {
  const [ballots, setBallots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBallots = async () => {
      try {
        setLoading(true);
        const data = await API.get("/ballots");
        setBallots(data);
      } catch (err) {
        setError("Failed to load ballots. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBallots();
  }, []);

  const isEligible = (ballot) => {
    // Only eligible voters and not already voted
    return ballot.canVote;
  };

  if (loading) return <p className="text-center mt-10">Loading ballots...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Available Ballots</h1>

      {ballots.length === 0 ? (
        <p className="text-center text-gray-500">No ballots available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ballots.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-xl shadow flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-xl font-semibold">{b.title}</h3>
                <p className="text-gray-500 mt-1">
                  {b.region} • {new Date(b.date).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    if (!isEligible(b)) {
                      alert(
                        b.voted
                          ? "You have already voted in this ballot."
                          : "You are not eligible to vote."
                      );
                      return;
                    }
                    navigate(`/vote/${b.id}`);
                  }}
                  className={`px-4 py-2 rounded-lg text-white transition ${isEligible(b)
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                  disabled={!isEligible(b)}
                >
                  {b.voted ? "Already Voted" : "Vote Now"}
                </button>

                <Link
                  to={`/candidates/${b.id}`}
                  className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  View Candidates
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
