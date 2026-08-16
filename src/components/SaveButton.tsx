"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SaveButton({
  opportunityId,
  initiallySaved,
  userId,
}: {
  opportunityId: string;
  initiallySaved: boolean;
  userId: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!userId) {
      router.push("/login");
      return;
    }
    setBusy(true);
    const next = !saved;
    setSaved(next); // optimistic

    if (next) {
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({ user_id: userId, opportunity_id: opportunityId });
      if (error) setSaved(false); // revert on failure
    } else {
      const { error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("user_id", userId)
        .eq("opportunity_id", opportunityId);
      if (error) setSaved(true); // revert on failure
    }
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Hiq nga të ruajturat" : "Ruaj"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-base transition-colors ${
        saved ? "border-acid bg-acid/10 text-acid" : "border-white/20 text-inksoft hover:border-white/40"
      }`}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}
