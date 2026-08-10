"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/opportunities");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="mb-8 text-3xl font-extrabold">Hyr</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder="Fjalëkalimi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink focus:border-acid focus:outline-none"
        />
        {error && <p className="text-sm text-pink">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary justify-center">
          {loading ? "..." : "Hyr"}
        </button>
      </form>

      <p className="mt-6 text-sm text-inksoft">
        Nuk ke llogari?{" "}
        <Link href="/signup" className="text-acid underline">
          Regjistrohu
        </Link>
      </p>
    </main>
  );
}
