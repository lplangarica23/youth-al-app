"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
          Nëse ka një llogari me këtë email, të dërguam një link për të vendosur
          një fjalëkalim të ri.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-3 text-3xl font-extrabold">Harrove fjalëkalimin?</h1>
      <p className="mb-8 text-inksoft">
        Shkruaj email-in tënd dhe do të dërgojmë një link për ta rivendosur.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink focus:border-acid focus:outline-none"
        />
        {error && <p className="text-sm text-pink">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary justify-center">
          {loading ? "..." : "Dërgo linkun"}
        </button>
      </form>

      <p className="mt-6 text-sm text-inksoft">
        <Link href="/login" className="text-acid underline">
          Kthehu te hyrja
        </Link>
      </p>
    </main>
  );
}
