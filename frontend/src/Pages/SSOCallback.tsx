import React from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

/**
 * SSOCallback page — Clerk redirects here after the Google OAuth handshake.
 * AuthenticateWithRedirectCallback finishes the session and then navigates
 * to the `redirectUrlComplete` URL that was set when initiating the OAuth flow.
 */
const SSOCallback: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <AuthenticateWithRedirectCallback />
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="w-12 h-12 relative">
          {/* Animated Pinterest "P" logo spinner */}
          <svg viewBox="0 0 24 24" fill="#e60023" className="w-12 h-12 animate-pulse">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">Signing you in…</p>
      </div>
    </div>
  );
};

export default SSOCallback;
