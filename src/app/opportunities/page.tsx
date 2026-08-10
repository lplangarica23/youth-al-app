import { createClient } from "@/lib/supabase/server";
import OpportunitiesBrowser from "@/components/OpportunitiesBrowser";
import { Opportunity } from "@/lib/types";

export default async function OpportunitiesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    // If this shows up, it usually means the schema hasn't been run yet,
    // or the .env.local values are missing/wrong. Check the README.
    console.error("Failed to load opportunities:", error.message);
  }

  const opportunities = (data as Opportunity[]) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-9 text-3xl font-extrabold sm:text-4xl">
        Mundësitë e fundit
      </h1>
      <OpportunitiesBrowser opportunities={opportunities} />
    </main>
  );
}
