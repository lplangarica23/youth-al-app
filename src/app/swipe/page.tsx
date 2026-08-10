import { createClient } from "@/lib/supabase/server";
import SwipeStack from "@/components/SwipeStack";
import { Opportunity } from "@/lib/types";

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

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="mb-2 text-sm font-bold uppercase tracking-wider text-inksoft">
        Luaj &amp; Zbulo
      </p>
      <h1 className="mb-3 text-4xl font-extrabold">Swipe Mode 🔥</h1>
      <p className="mb-12 text-inksoft">
        Djathtas nëse të pëlqen, majtas nëse jo. Provo!
      </p>

      <SwipeStack
        opportunities={(opportunities as Opportunity[]) ?? []}
        userId={userData?.user?.id ?? null}
      />
    </main>
  );
}
