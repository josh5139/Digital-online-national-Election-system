import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import API from "../api/api"; // Axios instance with JWT

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await API.get("/results"); // Backend endpoint
        setResults(data); // Example: [{name:'Candidate A', votes:120},...]
      } catch (err) {
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading results...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!results.length) return <p className="text-center mt-10">No results available yet.</p>;

  const data = {
    labels: results.map((r) => r.name),
    datasets: [
      {
        data: results.map((r) => r.votes),
        backgroundColor: [
          "#3b82f6",
          "#ef4444",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ec4899",
        ].slice(0, results.length), // pick enough colors
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Election Results</h1>
      <div className="bg-white p-6 rounded-xl shadow">
        <Pie data={data} />
        <div className="mt-4">
          {results.map((r, i) => (
            <div key={i} className="flex justify-between border-b py-1">
              <span>{r.name}</span>
              <span>{r.votes} votes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
