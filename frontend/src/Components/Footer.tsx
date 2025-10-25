import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 text-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-6 px-6">
        <div>
          <h4 className="text-lg font-semibold mb-2">Get our apps</h4>
          <ul>
            <li>iOS</li>
            <li>Android</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Quick links</h4>
          <ul>
            <li>Explore</li>
            <li>Shop</li>
            <li>Help Centre</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Policies</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-8 text-gray-400">© 2025 Pinterest</p>
    </footer>
  );
};

export default Footer;
