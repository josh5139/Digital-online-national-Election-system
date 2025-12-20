import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import API from "../api/api";
import { toast } from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await API.get("/votes/results");
      setResults(res.data);
    } catch (err) {
      toast.error("Failed to fetch results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const pieData = {
    labels: results.map(r => r.candidateName),
    datasets: [{
      data: results.map(r => r.votes),
      backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    }]
  };

  const barData = {
    labels: results.map(r => r.candidateName),
    datasets: [{
      label: "Votes",
      data: results.map(r => r.votes),
      backgroundColor: '#3b82f6'
    }]
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Candidate,Votes"].concat(results.map(r => `${r.candidateName},${r.votes}`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "election_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Election Results</h1>

      {loading ? <p className="text-center p-4">Loading...</p> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Vote Distribution (Pie)</h2>
              <Pie data={pieData} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Votes Per Candidate (Bar)</h2>
              <Bar data={barData} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Export CSV
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
