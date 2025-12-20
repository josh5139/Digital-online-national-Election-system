import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidates } from "../api/api";

export default function Candidates() {
  const { ballotId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6; // pagination

  const navigate = useNavigate();

  // Fetch candidates
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCandidates(ballotId);
        setCandidates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [ballotId]);

  // Filter candidates by search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.party.toLowerCase().includes(q)
    );
  }, [candidates, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  if (loading) return <p className="text-center mt-10">Loading candidates...</p>;
  if (!candidates.length) return <p className="text-center mt-10">No candidates found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Candidates</h1>

      {/* Search input */}
      <div className="flex justify-center mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search candidates..."
          className="border px-4 py-2 rounded w-full max-w-md"
        />
      </div>

      {/* Candidate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">{c.name}</h3>
              <p className="text-gray-500 mt-1">{c.party}</p>
            </div>
            <button
              onClick={() => navigate(`/vote/${ballotId}/${c.id}`)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Vote
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
