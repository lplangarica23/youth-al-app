"use client";

import { useMemo, useState } from "react";
import { Opportunity, Category } from "@/lib/types";
import OpportunityCard from "./OpportunityCard";

const FILTERS: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Të gjitha" },
  { key: "volunteering", label: "Vullnetarizëm" },
  { key: "erasmus", label: "Erasmus+" },
  { key: "ngo", label: "Aktivitete OJQ" },
];

export default function OpportunitiesBrowser({
  opportunities,
  userId,
  savedIds,
}: {
  opportunities: Opportunity[];
  userId?: string | null;
  savedIds?: string[];
}) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return opportunities.filter((op) => {
      if (filter !== "all" && op.category !== filter) return false;
      if (!query.trim()) return true;
      const haystack = `${op.title_al} ${op.org} ${op.location_al} ${op.description_al}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [opportunities, filter, query]);

  return (
    <div>
      <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`chip ${filter === f.key ? "active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko..."
          className="w-56 rounded-xl border-2 border-white/20 bg-panel px-4 py-2 text-sm text-ink placeholder:text-inkdim focus:border-acid focus:outline-none"
        />
      </div>

      <p className="mb-4 text-sm text-inksoft">{filtered.length} mundësi</p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-inksoft">
          <h3 className="mb-2 text-xl font-bold text-ink">
            Nuk u gjet asnjë mundësi
          </h3>
          <p>Provo një fjalë tjetër kërkimi ose zgjidh një kategori tjetër.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((op) => (
            <OpportunityCard
              key={op.id}
              op={op}
              userId={userId}
              initiallySaved={savedIds?.includes(op.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
