import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gray-100 border-t mt-10 overflow-hidden">

      {/* Animated Wave Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-[80px] animate-wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39 56.39C180.36 82.27 76.62 98.38 0 108.22V0h1200v27.35c-95.31 33.22-261.94 66.65-456.68 46.49C603.93 56.92 464.39 28.51 321.39 56.39z"
            className="fill-gray-200"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-500 relative z-10">

        {/* Left: Logo + Name */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Ethiopia Online National Election System
          </h2>
          <p className="text-sm mt-2 text-gray-600">
            Ensuring free, fair, transparent online elections.
          </p>
        </div>

        {/* Center: Contact */}
        <div>
          <h3 className="text-lg font-bold mb-2">Contact</h3>
          <p className="text-sm">
            📧 Email:{" "}
            <a
              href="mailto:info@nationalelection.et"
              className="text-blue-600 hover:underline transition"
            >
              info@nationalelection.et
            </a>
          </p>
          <p className="text-sm mt-1">
            📍 Address: National Election Board of Ethiopia, Addis Ababa
          </p>
        </div>

        {/* Right: Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-2xl text-gray-500">
            <a href="#" className="hover:text-blue-700 transition transform hover:scale-125" title="Facebook"><FaFacebook /></a>
            <a href="#" className="hover:text-pink-600 transition transform hover:scale-125" title="Instagram"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-500 transition transform hover:scale-125" title="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-600 transition transform hover:scale-125" title="Telegram"><FaTelegram /></a>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t bg-white py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Ethiopia Online Election • All Rights Reserved
      </div>

      {/* Tailwind Animation */}
      <style>
        {`
          @keyframes wave {
            0% { transform: translateX(0); }
            50% { transform: translateX(-25%); }
            100% { transform: translateX(0); }
          }
          .animate-wave {
            animation: wave 6s ease-in-out infinite;
          }
        `}
      </style>
    </footer>
  );
}
