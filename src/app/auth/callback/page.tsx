"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let handled = false;

    // Listen for auth state changes — this catches the implicit flow
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !handled) {
        handled = true;
        router.push("/dashboard");
      }
    });

    // Check if we already have a session (e.g. from hash fragment)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !handled) {
        handled = true;
        router.push("/dashboard");
        return;
      }

      // Try exchanging the code from the URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code && !handled) {
        supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
          if (error) {
            console.error("Auth callback error:", error.message);
            setError(error.message);
          } else if (data.session && !handled) {
            handled = true;
            router.push("/dashboard");
          }
        });
      }
    });

    // Timeout — if nothing happens in 8 seconds, show error
    const timeout = setTimeout(() => {
      if (!handled) {
        setError("Sign in is taking too long. Please try again.");
      }
    }, 8000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-6">
          <p className="text-sm text-red-400 font-body">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-3 rounded-full bg-foreground text-background font-body font-semibold text-sm"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground font-body">Signing you in...</p>
      </div>
    </div>
  );
}
