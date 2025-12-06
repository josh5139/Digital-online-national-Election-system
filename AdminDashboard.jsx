import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API from "../api/api"; // Axios instance with JWT
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ voters: 0, votes: 0, candidates: 0 });
  const [results, setResults] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [votersRes, votesRes, candidatesRes] = await Promise.all([
          API.get("/voters"),
          API.get("/votes"),
          API.get("/candidates"),
        ]);

        setStats({
          voters: votersRes.data.length,
          votes: votesRes.data.length,
          candidates: candidatesRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        const res = await API.get("/results"); // Example: [{name, votes}]
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, []);

  const cardData = [
    { title: "Total Voters", value: stats.voters, color: "bg-blue-500" },
    { title: "Total Votes", value: stats.votes, color: "bg-green-500" },
    { title: "Candidates", value: stats.candidates, color: "bg-purple-500" },
  ];

  const pieData = {
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
        ].slice(0, results.length),
      },
    ],
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((card) => (
          <div
            key={card.title}
            className={`${card.color} text-white p-6 rounded shadow flex flex-col justify-between`}
          >
            <span className="text-lg">{card.title}</span>
            <span className="text-3xl font-bold">
              {loadingStats ? "..." : card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Election Results */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Election Results Overview</h2>
        {loadingResults ? (
          <p>Loading results...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No results available yet.</p>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
              <Pie data={pieData} />
            </div>
            <div className="w-full md:w-1/2">
              <ul>
                {results.map((r, i) => (
                  <li
                    key={i}
                    className="flex justify-between py-1 border-b"
                  >
                    <span>{r.name}</span>
                    <span>{r.votes} votes</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
