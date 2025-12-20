import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Candidates", path: "/admin/candidates" },
    { name: "Voters", path: "/admin/voters" },
    { name: "Results", path: "/admin/results" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token"); // clear voter/admin token
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`py-2 px-4 rounded transition-colors ${location.pathname === item.path
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>

        {/* Optional Footer */}
        <div className="mt-4 pt-4 border-t text-gray-500 text-sm">
          Logged in as Admin
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</main>
    </div>
  );
}
