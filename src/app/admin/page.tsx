import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";
import { Opportunity } from "@/lib/types";
import { approveOpportunity, rejectOpportunity } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="mb-2 text-2xl font-extrabold">Nuk ke qasje këtu</h1>
        <p className="text-inksoft">
          Kjo faqe është vetëm për administratorët e youth.al.
        </p>
      </main>
    );
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("opportunities")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const pending = (data as Opportunity[]) ?? [];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-extrabold">Shqyrto mundësitë</h1>
      <p className="mb-10 text-inksoft">
        {pending.length} mundësi në pritje të shqyrtimit.
      </p>

      {pending.length === 0 ? (
        <p className="text-inksoft">Asgjë në pritje për momentin ✨</p>
      ) : (
        <div className="flex flex-col gap-5">
          {pending.map((op) => (
            <div
              key={op.id}
              className="rounded-2xl border-2 border-white/20 bg-panel p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <span className="mb-2 inline-block rounded-full border border-inkdim px-3 py-1 text-xs font-bold uppercase text-inkdim">
                    {op.category}
                  </span>
                  <h3 className="text-lg font-bold">{op.title_al}</h3>
                  <p className="text-sm text-inksoft">
                    {op.org} · {op.location_al}
                  </p>
                </div>
              </div>
              <p className="mb-4 text-sm text-inksoft">{op.description_al}</p>
              <div className="flex gap-3">
                <form
                  action={async () => {
                    "use server";
                    await approveOpportunity(op.id);
                  }}
                >
                  <button type="submit" className="btn-primary">
                    Aprovo ✓
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await rejectOpportunity(op.id);
                  }}
                >
                  <button type="submit" className="btn-ghost">
                    Refuzo ✕
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
