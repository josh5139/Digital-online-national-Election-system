import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 10000,
});

// Auto attach JWT token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

// =====================
// AUTH
// =====================
export async function login(nationalId, password) {
  const res = await API.post("/auth/login", { nationalId, password });
  return res.data;
}

// =====================
// VOTER / BALLOTS
// =====================
export async function getBallot(region) {
  const res = await API.get(`/ballots/${region}`);
  return res.data;
}

export async function submitVote(payload) {
  const token = localStorage.getItem("token");
  const res = await API.post("/votes", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// =====================
// CANDIDATES
// =====================
export async function getCandidates(ballotId) {
  // optional: get candidates by ballot
  const url = ballotId ? `/ballots/${ballotId}/candidates` : "/candidates";
  const res = await API.get(url);
  return res.data;
}

export async function addCandidate(data) {
  const res = await API.post("/candidates", data);
  return res.data;
}

export async function updateCandidate(id, data) {
  const res = await API.put(`/candidates/${id}`, data);
  return res.data;
}

export async function deleteCandidate(id) {
  const res = await API.delete(`/candidates/${id}`);
  return res.data;
}

// =====================
// VOTERS (Admin)
// =====================
export async function getVoters() {
  const res = await API.get("/voters");
  return res.data;
}

// =====================
// RESULTS
// =====================
export async function getResults() {
  const res = await API.get("/results");
  return res.data;
}

// =====================
// EXPORT DEFAULT
// =====================
export default API;
