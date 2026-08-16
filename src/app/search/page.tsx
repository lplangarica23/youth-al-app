import { createClient } from "@/lib/supabase/server";
import { Opportunity, Category } from "@/lib/types";
import { rankOpportunities, countSavedCategories } from "@/lib/ranking";
import SearchResults from "@/components/SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("opportunities").select("*").eq("status", "approved");

  if (q && q.trim()) {
    // websearch_to_tsquery handles natural phrasing ("praktikë verore
    // tiranë") much better than a raw AND/OR query would.
    query = query.textSearch("search_doc", q.trim(), {
      type: "websearch",
      config: "simple",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: opportunities } = await query.limit(60);

  let profile: {
    interests: Category[];
    city: string | null;
    age: number | null;
    experience_level: "none" | "some" | "experienced" | null;
  } | null = null;
  let savedCategoryCounts = {};
  let savedIds = new Set<string>();

  if (user) {
    const [{ data: profileData }, { data: savedData }] = await Promise.all([
      supabase
        .from("profiles")
        .select("interests, city, age, experience_level")
        .eq("id", user.id)
        .single(),
      supabase
        .from("saved_opportunities")
        .select("opportunity_id, opportunities(category)")
        .eq("user_id", user.id),
    ]);
    profile = profileData as typeof profile;
    const saved = (savedData as unknown as { opportunity_id: string; opportunities: { category: Category } | null }[]) ?? [];
    savedCategoryCounts = countSavedCategories(saved);
    savedIds = new Set(saved.map((s) => s.opportunity_id));
  }

  const ranked = rankOpportunities(
    (opportunities as Opportunity[]) ?? [],
    profile,
    savedCategoryCounts
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <SearchResults
        initialQuery={q ?? ""}
        results={ranked}
        isPersonalized={!!user}
        profile={profile}
        userId={user?.id ?? null}
        savedIds={Array.from(savedIds)}
      />
    </main>
  );
}
