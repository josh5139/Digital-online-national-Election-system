import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./component/NavBar";
import Footer from "./component/Footer";
import "./i18n"; // i18n setup

// Pages
import Home from "./page/home";
import Login from "./page/Login";
import Register from "./page/Register";
import Ballots from "./page/Ballots";
import Vote from "./page/Vote";
import Candidates from "./page/Candidates";
import Results from "./page/Results";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";

// Admin components
import AdminRoute from "./component/AdminRoute";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminCandidates from "./admin/AdminCandidates";
import AdminVoters from "./admin/AdminVoters";
import AdminResults from "./admin/AdminResults";

export default function App() {
  const [userRole, setUserRole] = useState(null);

  // Load user role from localStorage and auto-update on change
  useEffect(() => {
    const loadRole = () => setUserRole(localStorage.getItem("role"));
    loadRole();
    window.addEventListener("storage", loadRole);
    return () => window.removeEventListener("storage", loadRole);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Pass userRole to NavBar for role-based menu */}
      <NavBar userRole={userRole} />

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ballots" element={<Ballots />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected voter routes */}
          <Route
            path="/vote"
            element={
              <ProtectedRoute>
                <Vote />
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <AdminRoute>
                <AdminCandidates />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/voters"
            element={
              <AdminRoute>
                <AdminVoters />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <AdminRoute>
                <AdminResults />
              </AdminRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
