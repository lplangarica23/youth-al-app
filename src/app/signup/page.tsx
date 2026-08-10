"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-extrabold">Kontrollo email-in tënd</h1>
        <p className="text-inksoft">
          Të dërguam një link konfirmimi. Kliko atë për të aktivizuar llogarinë.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-8 text-3xl font-extrabold">Regjistrohu</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          required
          placeholder="Emri"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink focus:border-acid focus:outline-none"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink focus:border-acid focus:outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Fjalëkalimi (min. 6 shkronja)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink focus:border-acid focus:outline-none"
        />
        {error && <p className="text-sm text-pink">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary justify-center">
          {loading ? "..." : "Regjistrohu"}
        </button>
      </form>

      <p className="mt-6 text-sm text-inksoft">
        Ke tashmë llogari?{" "}
        <Link href="/login" className="text-acid underline">
          Hyr
        </Link>
      </p>
    </main>
  );
}
