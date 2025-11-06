import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { FaPinterest } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center">
              <FaPinterest className="text-[#e60023] text-3xl" />
            </a>
          </div>

          {/* Middle section */}
          <div className="flex-1 flex items-center justify-center space-x-6 max-w-4xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full font-semibold transition ${
                  isActive
                    ? "transition: all 0.25s ease-in-out bg-black/5 text-black"
                    : "transition: all 0.25s ease-in-out text-[#111111] hover:bg-black/5"
                }`
              }
            >
              Explore
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive
                    ? "bg-black/5 text-black font-semibold"
                    : "text-[#111111] hover:bg-black/5"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/business"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive
                    ? "bg-black/5 text-black font-semibold"
                    : "text-[#111111] hover:bg-black/5"
                }`
              }
            >
              Businesses
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive
                    ? "bg-black/5 text-black font-semibold"
                    : "text-[#111111] hover:bg-black/5"
                }`
              }
            >
              Create
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition ${
                  isActive
                    ? "bg-black/5 text-black font-semibold"
                    : "text-[#111111] hover:bg-black/5"
                }`
              }
            >
              News
            </NavLink>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white bg-[#e60023] hover:bg-[#d50c22] px-4 py-2 rounded-full font-semibold">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-[#efefef] hover:bg-[#e2e2e2] text-black px-4 py-2 rounded-full font-semibold">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
