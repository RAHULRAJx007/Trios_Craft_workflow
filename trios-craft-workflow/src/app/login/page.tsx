"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/getCurrentUserRole";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const role = await getCurrentUserRole();

      if (!mounted) return;

      if (role) {
        router.replace(
          role === "admin" ? "/" : role === "member" ? "/my-tasks" : "/client"
        );
        return;
      }

      setLoading(false);
    }

    void checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function login() {
    setSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      alert(error.message);
      return;
    }

    const signedInEmail =
      data.user?.email?.trim().toLowerCase() ||
      data.session?.user?.email?.trim().toLowerCase() ||
      email.trim().toLowerCase();

    const signedInUserId =
      data.user?.id || data.session?.user?.id || undefined;

    const role = await getCurrentUserRole(signedInEmail, signedInUserId);

    if (!role) {
      alert(
        "Login succeeded, but we could not determine your role. Please check that your Supabase profile or client user record has a valid role."
      );
      return;
    }

    router.replace(
      role === "admin" ? "/" : role === "member" ? "/my-tasks" : "/client"
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md text-center">
          <div className="text-lg font-semibold">Checking authentication...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-slate-800 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-slate-800 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={submitting}
          onClick={login}
          className="w-full bg-blue-600 p-3 rounded"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
