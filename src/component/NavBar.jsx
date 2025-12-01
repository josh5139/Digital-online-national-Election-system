import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || null);
  const [langOpen, setLangOpen] = useState(false);

  const langRef = useRef();

  // Listen for role updates
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLangOpen(false);
  };

  // NAVIGATION ITEMS
  const navItems = [
    { name: t("home"), path: "/" },
    { name: t("ballots"), path: "/ballots" },
    { name: t("vote"), path: "/vote" },
    { name: t("candidates"), path: "/candidates" },
    { name: t("results"), path: "/results" },
    { name: t("admin"), path: "/admin", roles: ["admin"] },
    { name: t("login"), path: "/login", roles: ["guest"] },
    {
      name: t("logout"),
      path: "/",
      roles: ["admin", "voter"],
      action: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUserRole(null);
        navigate("/");
      },
    },
  ];

  const visibleLinks = navItems.filter((item) => {
    if (!item.roles) return true;
    if (item.roles.includes("admin") && userRole === "admin") return true;
    if (item.roles.includes("voter") && userRole === "voter") return true;
    if (item.roles.includes("guest") && !userRole) return true;
    return false;
  });

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white animate-slide-down">
      {/* HEADER TOP */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="animate-bounce">
            <Logo size={56} />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl md:text-3xl font-extrabold text-gray-800 animate-text-slide">
              የኢትዮጵያ ኦንላይን የምርጫ ሥርዓት
            </h1>
            <p className="text-sm text-gray-600 animate-fade-in-delay">
              Ethiopia Online National Election System
            </p>
          </div>
        </div>

        {/* Search + Language + Mobile */}
        <div className="flex items-center gap-3 relative">
          {/* DESKTOP SEARCH */}
          <div className="hidden md:block relative group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="border rounded-full px-4 py-1 w-64 text-sm shadow-sm focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform group-hover:scale-105"
            />
            <span className="absolute right-3 top-1 text-gray-400">🔍</span>
          </div>

          {/* MOBILE SEARCH BUTTON */}
          <button
            className="md:hidden px-3 py-2 border rounded text-gray-600 hover:bg-gray-100 transition transform hover:scale-110"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            🔍
          </button>

          {/* LANGUAGE DROPDOWN */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="border rounded px-3 py-1 text-sm hover:bg-gray-100 flex items-center gap-1 transition transform hover:scale-105"
            >
              {t("language")} ▼
            </button>

            <ul
              className={`absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg transition-all duration-300 ${langOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
              <li
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition transform hover:scale-105"
                onClick={() => changeLanguage("en")}
              >
                English
              </li>
              <li
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition transform hover:scale-105"
                onClick={() => changeLanguage("am")}
              >
                Amharic
              </li>
              <li
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition transform hover:scale-105"
                onClick={() => changeLanguage("om")}
              >
                Afan Oromo
              </li>
            </ul>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden px-3 py-2 border rounded text-gray-600 hover:bg-gray-100 transition transform hover:scale-110"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            {drawerOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH INPUT */}
      {mobileSearchOpen && (
        <div className="md:hidden px-6 pb-4 animate-slide-down">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full border rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
          />
        </div>
      )}

      {/* DESKTOP NAV */}
      <nav className="hidden md:block bg-teal-600">
        <ul className="max-w-7xl mx-auto flex gap-6 py-3 text-white justify-center">
          {visibleLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="relative group">
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="px-3 py-2 rounded hover:bg-teal-500 transition transform hover:scale-110"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded transition transform ${isActive
                      ? "font-semibold underline underline-offset-4 scale-110"
                      : "hover:bg-teal-500 hover:scale-105"
                      }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-teal-600 text-white shadow-xl z-50 transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col gap-4">
          {visibleLinks.map((item) =>
            item.action ? (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  setDrawerOpen(false);
                }}
                className="px-3 py-2 rounded hover:bg-teal-500 text-left transition transform hover:scale-105"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                className={`px-3 py-2 rounded transition transform ${location.pathname === item.path
                  ? "bg-white text-teal-600 scale-110"
                  : "hover:bg-teal-500 hover:scale-105"
                  }`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 animate-fade-in"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes slide-down {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-down {
            animation: slide-down 0.5s ease forwards;
          }
          @keyframes text-slide {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-text-slide {
            animation: text-slide 1s ease forwards;
          }
          .animate-fade-in-delay {
            animation: fadeIn 1.5s ease forwards;
            opacity: 0;
          }
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          .animate-bounce {
            animation: bounce 2s infinite;
          }
        `}
      </style>
    </header>
  );
}
