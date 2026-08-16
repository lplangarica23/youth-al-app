"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CHIPS = [
  { label: "Një mundësi", query: "mundësi" },
  { label: "Një udhëtim", query: "udhëtim" },
  { label: "Një shtëpi", query: "shtëpi" },
];

export default function SearchHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(q: string) {
    const trimmed = q.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="flex items-stretch overflow-hidden rounded-2xl border-2 border-white/20 bg-panel focus-within:border-acid"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="p.sh. praktikë verore në Tiranë..."
          className="flex-1 bg-transparent px-6 py-5 text-lg text-ink placeholder:text-inkdim focus:outline-none"
        />
        <button type="submit" className="btn-primary m-2 rounded-xl">
          Kërko
        </button>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <button key={c.query} onClick={() => submit(c.query)} className="chip">
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
