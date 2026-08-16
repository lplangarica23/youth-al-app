"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmedAge, setConfirmedAge] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Belt-and-suspenders: the checkbox is already `required` at the
    // HTML level, but double-check here too rather than rely on that
    // alone — this is the actual product-side enforcement of the 18+
    // policy, not just a UI nicety.
    if (!confirmedAge) {
      setError("Duhet të konfirmosh që je mbi 18 vjeç për t'u regjistruar.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          confirmed_18_plus: true,
        },
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

        <label className="flex items-start gap-3 text-sm text-inksoft">
          <input
            type="checkbox"
            required
            checked={confirmedAge}
            onChange={(e) => setConfirmedAge(e.target.checked)}
            className="mt-1"
          />
          <span>
            Konfirmoj se jam të paktën <strong className="text-ink">18 vjeç</strong>. youth.al
            është aktualisht i disponueshëm vetëm për përdorues 18+.
          </span>
        </label>

        <p className="text-xs text-inkdim">
          Duke u regjistruar, pranon{" "}
          <Link href="/terms" className="underline hover:text-inksoft">
            Kushtet e Përdorimit
          </Link>{" "}
          dhe{" "}
          <Link href="/privacy" className="underline hover:text-inksoft">
            Politikën e Privatësisë
          </Link>
          .
        </p>

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
