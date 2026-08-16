import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Opportunity } from "@/lib/types";
import SavedList from "@/components/SavedList";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-extrabold">Të Ruajturat</h1>
        <p className="mb-6 text-inksoft">
          Duhet të hysh në llogari për të parë mundësitë e ruajtura.
        </p>
        <Link href="/login" className="btn-primary">
          Hyr
        </Link>
      </main>
    );
  }

  const { data } = await supabase
    .from("saved_opportunities")
    .select("application_status, saved_at, opportunities(*)")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  const items = (
    (data as unknown as {
      application_status: "saved" | "applying" | "applied";
      opportunities: Opportunity;
    }[]) ?? []
  ).filter((row) => row.opportunities);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">Të Ruajturat</h1>
      <p className="mb-10 text-inksoft">
        Mundësitë që ke ruajtur — shëno se ku je me secilën prej tyre.
      </p>

      {items.length === 0 ? (
        <div className="py-16 text-center text-inksoft">
          <p className="mb-4">Ende nuk ke ruajtur asnjë mundësi.</p>
          <Link href="/swipe" className="btn-primary">
            Provo Swipe Mode 🔥
          </Link>
        </div>
      ) : (
        <SavedList items={items} />
      )}
    </main>
  );
}
