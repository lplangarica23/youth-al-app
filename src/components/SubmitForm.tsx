"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/lib/types";

export default function SubmitForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const deadlineRaw = form.get("deadline") as string;

    const { error } = await supabase.from("opportunities").insert({
      category: form.get("category") as Category,
      title_al: form.get("title_al") as string,
      title_en: form.get("title_en") as string,
      org: form.get("org") as string,
      location_al: form.get("location_al") as string,
      location_en: form.get("location_en") as string,
      deadline: deadlineRaw ? deadlineRaw : null,
      description_al: form.get("description_al") as string,
      description_en: form.get("description_en") as string,
      link: (form.get("link") as string) || null,
      submitted_by: userId,
      status: "pending",
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border-2 border-acid/40 bg-panel p-8 text-center">
        <h2 className="mb-2 text-2xl font-extrabold">Faleminderit! 🎉</h2>
        <p className="text-inksoft">
          Mundësia jote u dërgua për shqyrtim. Do të shfaqet publikisht sapo të
          aprovohet.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink placeholder:text-inkdim focus:border-acid focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-sm font-bold text-inksoft">Kategoria</label>
        <select name="category" required className={inputClass} defaultValue="volunteering">
          <option value="volunteering">Vullnetarizëm</option>
          <option value="erasmus">Erasmus+</option>
          <option value="ngo">Aktivitet OJQ</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="title_al" required placeholder="Titulli (shqip)" className={inputClass} />
        <input name="title_en" required placeholder="Title (English)" className={inputClass} />
      </div>

      <input name="org" required placeholder="Emri i organizatës" className={inputClass} />

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="location_al" required placeholder="Vendndodhja (shqip)" className={inputClass} />
        <input name="location_en" required placeholder="Location (English)" className={inputClass} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-inksoft">
          Afati (lëre bosh nëse është i hapur)
        </label>
        <input type="date" name="deadline" className={inputClass} />
      </div>

      <textarea
        name="description_al"
        required
        rows={3}
        placeholder="Përshkrimi (shqip)"
        className={inputClass}
      />
      <textarea
        name="description_en"
        required
        rows={3}
        placeholder="Description (English)"
        className={inputClass}
      />

      <input name="link" type="url" placeholder="Link për aplikim (opsionale)" className={inputClass} />

      {error && <p className="text-sm text-pink">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary justify-center">
        {submitting ? "..." : "Dërgo për shqyrtim"}
      </button>
    </form>
  );
}
