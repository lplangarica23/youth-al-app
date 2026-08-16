"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types";
import { EligibilityProfile } from "@/lib/eligibility";
import OpportunityCard from "./OpportunityCard";

export default function SearchResults({
  initialQuery,
  results,
  isPersonalized,
  profile,
  userId,
  savedIds,
}: {
  initialQuery: string;
  results: { op: Opportunity; reason: string | null }[];
  isPersonalized: boolean;
  profile?: EligibilityProfile | null;
  userId?: string | null;
  savedIds?: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <div>
      <form
        onSubmit={submit}
        className="mb-3 flex items-stretch overflow-hidden rounded-2xl border-2 border-white/20 bg-panel focus-within:border-acid"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko..."
          className="flex-1 bg-transparent px-5 py-4 text-ink placeholder:text-inkdim focus:outline-none"
        />
        <button type="submit" className="btn-primary m-2 rounded-xl">
          Kërko
        </button>
      </form>

      {!isPersonalized && (
        <p className="mb-8 text-sm text-inkdim">
          <Link href="/login" className="text-acid underline">
            Hyr
          </Link>{" "}
          për rezultate të personalizuara sipas interesave dhe historikut tënd.
        </p>
      )}

      <p className="mb-6 text-sm text-inksoft">
        {results.length} rezultate {initialQuery && <>për &ldquo;{initialQuery}&rdquo;</>}
      </p>

      {results.length === 0 ? (
        <div className="py-20 text-center text-inksoft">
          <h3 className="mb-2 text-xl font-bold text-ink">Asgjë për momentin</h3>
          <p>Provo një fjalë tjetër, ose shiko të gjitha mundësitë.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {results.map(({ op, reason }) => (
            <OpportunityCard
              key={op.id}
              op={op}
              reason={reason}
              profile={profile}
              userId={userId}
              initiallySaved={savedIds?.includes(op.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
