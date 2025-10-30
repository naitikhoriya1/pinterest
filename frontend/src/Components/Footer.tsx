import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-20 md:py-28">
      {" "}
      {/* Increased height */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-16 md:gap-0">
        {/* Logo Section */}
        <div className="flex flex-col space-y-8 w-3 md:w-1/5">
          <img
            src="../public/pinlogo.png"
            alt="Pinterest Logo"
            className="w-24 md:w-28" // reduced from w-36 md:w-40
          />
          <p className="text-xs text-gray-400 tracking-wide">
            © 2025 Pinterest — All rights reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-evenly w-full md:w-2/3 gap-y-10">
          {/* Get the App */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-white text-lg">
              Get the App
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="hover:text-white transition">iOS</li>
              <li className="hover:text-white transition">Android</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-white text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="hover:text-white transition">Explore</li>
              <li className="hover:text-white transition">Shop</li>
              <li className="hover:text-white transition">Users</li>
              <li className="hover:text-white transition">Collections</li>
              <li className="hover:text-white transition">Shopping</li>
              <li className="hover:text-white transition">Help Centre</li>
            </ul>
          </div>

          {/* Policies */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-white text-lg">Policies</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="hover:text-white transition">Terms of Service</li>
              <li className="hover:text-white transition">Privacy Policy</li>
              <li className="hover:text-white transition">Non-user Notice</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
