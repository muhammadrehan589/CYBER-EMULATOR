"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // callbackUrl="/" lets page.tsx handle role-based routing (Admin → /admin, etc.)
    await signIn("google", { callbackUrl: "/" });
    // State resets automatically on redirect — this line only runs on error.
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="relative px-8 py-4 font-mono font-black tracking-widest text-white uppercase transition-all duration-300 rounded-lg group overflow-hidden bg-black border border-[#ff0055] hover:border-[#ff00aa] hover:shadow-[0_0_20px_#ff0055,inset_0_0_10px_#ff0055] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 w-full h-full bg-[#ff0055] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-[#ff0055] border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        )}
        <span>{isLoading ? "Connecting..." : "Initialize via Google"}</span>
      </div>
    </button>
  );
}
