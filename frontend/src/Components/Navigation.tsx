import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { FaPinterest } from "react-icons/fa";

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
            <a
              href="/"
              className="text-black hover:bg-black/5 px-4 py-2 rounded-full font-semibold"
            >
              Explore
            </a>
            <a
              href="/about"
              className="text-[#111111] hover:bg-black/5 px-4 py-2 rounded-full"
            >
              About
            </a>
            <a
              href="/business"
              className="text-[#111111] hover:bg-black/5 px-4 py-2 rounded-full"
            >
              Businesses
            </a>
            <a
              href="/create"
              className="text-[#111111] hover:bg-black/5 px-4 py-2 rounded-full"
            >
              Create
            </a>
            <a
              href="/news"
              className="text-[#111111] hover:bg-black/5 px-4 py-2 rounded-full"
            >
              News
            </a>
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
