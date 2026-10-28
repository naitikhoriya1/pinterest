import React from "react";
import { SignedOut } from "@clerk/clerk-react";
import GoogleAuthButton from "./GoogleAuthButton";

const SignupSection: React.FC = () => {
  return (
    <SignedOut>
      <section
        id="signup-section"
        className="relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-[#fff8f0] to-[#f0f4ff] py-24"
      >
        {/* Decorative background blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#e60023]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#4285F4]/10 blur-3xl"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#f0d0d5] text-[#e60023] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm mb-6">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            Join 450+ million Pinners
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight mb-4">
            Your next big idea
            <br />
            <span className="text-[#e60023]">starts here.</span>
          </h2>

          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Save ideas you love, get personalised recommendations, and discover
            new inspirations tailored to your taste — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Google button */}
            <GoogleAuthButton
              mode="sign-up"
              size="lg"
              variant="white"
              label="Continue with Google"
              className="shadow-sm w-full sm:w-auto"
            />

            {/* Secondary Pinterest email signup */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Fallback to Clerk modal for email sign-up
                (document.querySelector("[data-clerk-sign-up]") as HTMLElement | null)?.click();
              }}
              className="
                inline-flex items-center justify-center gap-2
                bg-[#e60023] text-white font-medium
                px-8 py-4 text-lg rounded-full
                hover:bg-[#cc001f] active:bg-[#b0001a]
                transition-all duration-200 shadow-sm
                w-full sm:w-auto
              "
            >
              Sign up with email
            </a>
          </div>

          {/* Trust signals */}
          <p className="mt-8 text-xs text-gray-400">
            By continuing, you agree to Pinterest's{" "}
            <a
              href="https://policy.pinterest.com/en/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and acknowledge you've read our{" "}
            <a
              href="https://policy.pinterest.com/en/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>

          {/* Already have account */}
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <GoogleAuthButton
              mode="sign-in"
              size="sm"
              variant="white"
              label="Log in"
              className="inline-flex !px-3 !py-1 text-[#e60023] border-[#e60023]/30 hover:border-[#e60023]/60 font-semibold"
            />
          </p>
        </div>
      </section>
    </SignedOut>
  );
};

export default SignupSection;
