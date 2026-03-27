"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    // Handle the code exchange from the URL
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("Auth callback error:", error.message);
          router.push("/auth");
        } else {
          router.push("/dashboard");
        }
      });
    } else if (hash) {
      // Implicit flow — Supabase SDK picks up the token from the hash automatically
      // The onAuthStateChange listener above will handle the redirect
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground font-body">Signing you in...</p>
      </div>
    </div>
  );
}
