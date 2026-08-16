import { createClient } from "@/lib/supabase/server";
import SwipeStack from "@/components/SwipeStack";
import { Opportunity, Category } from "@/lib/types";
import { rankOpportunities, countSavedCategories } from "@/lib/ranking";

export default async function SwipePage() {
  const supabase = await createClient();

  const [{ data: opportunities }, { data: userData }] = await Promise.all([
    supabase
      .from("opportunities")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const user = userData?.user ?? null;
  let profile: {
    interests: Category[];
    city: string | null;
    age: number | null;
    experience_level: "none" | "some" | "experienced" | null;
  } | null = null;
  let savedCategoryCounts = {};

  if (user) {
    const [{ data: profileData }, { data: savedData }] = await Promise.all([
      supabase.from("profiles").select("interests, city, age, experience_level").eq("id", user.id).single(),
      supabase
        .from("saved_opportunities")
        .select("opportunities(category)")
        .eq("user_id", user.id),
    ]);
    profile = profileData as typeof profile;
    savedCategoryCounts = countSavedCategories(
      (savedData as { opportunities: { category: Category } | null }[]) ?? []
    );
  }

  // The deck order itself is the personalization — best-fit cards
  // surface first, instead of a random shuffle.
  const ranked = rankOpportunities(
    (opportunities as Opportunity[]) ?? [],
    profile,
    savedCategoryCounts
  ).map((r) => r.op);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-inksoft">
        Luaj &amp; Zbulo
      </p>
      <h1 className="mb-3 text-4xl font-extrabold">Swipe Mode 🔥</h1>
      <p className="mb-12 text-inksoft">
        Djathtas nëse të pëlqen, majtas nëse jo.{" "}
        {user ? "Rradha është e personalizuar për ty." : "Provo!"}
      </p>

      <SwipeStack opportunities={ranked} userId={user?.id ?? null} />
    </main>
  );
}
