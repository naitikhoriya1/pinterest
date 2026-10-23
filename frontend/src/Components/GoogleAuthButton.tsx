import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

interface GoogleAuthButtonProps {
  mode?: "sign-in" | "sign-up";
  size?: "sm" | "md" | "lg";
  variant?: "white" | "dark" | "red";
  className?: string;
  label?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  mode = "sign-up",
  size = "md",
  variant = "white",
  className = "",
  label,
}) => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (mode === "sign-in") {
        await signIn?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      } else {
        await signUp?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setIsLoading(false);
    }
  };

  const defaultLabel = mode === "sign-in" ? "Continue with Google" : "Continue with Google";
  const buttonLabel = label ?? defaultLabel;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm gap-2",
    md: "px-6 py-3 text-base gap-3",
    lg: "px-8 py-4 text-lg gap-3",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    white:
      "bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#c6c6c6] hover:shadow-md active:bg-[#f1f3f4]",
    dark: "bg-[#1a1a1a] text-white border border-transparent hover:bg-[#2d2d2d] hover:shadow-md active:bg-[#3d3d3d]",
    red: "bg-[#e60023] text-white border border-transparent hover:bg-[#cc001f] hover:shadow-md active:bg-[#b0001a]",
  };

  return (
    <button
      id={`google-${mode}-btn`}
      onClick={handleGoogleAuth}
      disabled={isLoading}
      aria-label={buttonLabel}
      className={`
        relative inline-flex items-center justify-center font-medium rounded-full
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-60 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin"
            width={iconSize[size]}
            height={iconSize[size]}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Signing in…</span>
        </>
      ) : (
        <>
          {/* Official Google "G" Logo SVG */}
          <svg
            width={iconSize[size]}
            height={iconSize[size]}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>{buttonLabel}</span>
        </>
      )}
    </button>
  );
};

export default GoogleAuthButton;
