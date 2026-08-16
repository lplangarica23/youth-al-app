"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Supabase's client detects the recovery token from the email link's
    // URL automatically, but it happens asynchronously — we wait for the
    // PASSWORD_RECOVERY event before showing the form, so someone can't
    // submit before the recovery session is actually ready.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If no recovery event fires within a few seconds, the link is
    // probably invalid or expired — show a clear message instead of a
    // form that will just fail.
    const timeout = window.setTimeout(() => {
      setReady((current) => {
        if (!current) setInvalidLink(true);
        return current;
      });
    }, 4000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    window.setTimeout(() => router.push("/login"), 2000);
  }

  if (done) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-extrabold">U ndryshua! 🎉</h1>
        <p className="text-inksoft">Fjalëkalimi u rivendos. Po të çojmë te hyrja...</p>
      </main>
    );
  }

  if (invalidLink) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-extrabold">Linku ka skaduar</h1>
        <p className="mb-6 text-inksoft">
          Ky link nuk është më i vlefshëm. Kërko një link të ri.
        </p>
        <a href="/forgot-password" className="btn-primary">
          Provo përsëri
        </a>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 text-center">
        <p className="text-inksoft">Duke verifikuar linkun...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-8 text-3xl font-extrabold">Vendos fjalëkalim të ri</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          required
          minLength={6}
          placeholder="Fjalëkalimi i ri (min. 6 shkronja)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink focus:border-acid focus:outline-none"
        />
        {error && <p className="text-sm text-pink">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary justify-center">
          {loading ? "..." : "Ruaj fjalëkalimin e ri"}
        </button>
      </form>
    </main>
  );
}
