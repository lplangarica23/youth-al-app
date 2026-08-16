"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/lib/types";

type Draft = {
  category: Category;
  title_al: string;
  title_en: string;
  org: string;
  location_al: string;
  location_en: string;
  deadline: string;
  description_al: string;
  description_en: string;
  link: string;
  min_age: string;
  max_age: string;
  requires_experience: boolean;
  travel_funded: boolean;
  accommodation_funded: boolean;
  food_funded: boolean;
  participation_fee: string;
};

const EMPTY_DRAFT: Draft = {
  category: "volunteering",
  title_al: "",
  title_en: "",
  org: "",
  location_al: "",
  location_en: "",
  deadline: "",
  description_al: "",
  description_en: "",
  link: "",
  min_age: "",
  max_age: "",
  requires_experience: false,
  travel_funded: false,
  accommodation_funded: false,
  food_funded: false,
  participation_fee: "",
};

export default function SubmitForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const [rawText, setRawText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleParse() {
    setParsing(true);
    setParseError(null);
    try {
      const res = await fetch("/api/parse-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setParseError(data.error || "Diçka shkoi keq.");
        return;
      }
      const aiDraft = data.draft ?? {};
      setDraft({
        ...EMPTY_DRAFT,
        ...aiDraft,
        link: "",
        min_age: aiDraft.min_age != null ? String(aiDraft.min_age) : "",
        max_age: aiDraft.max_age != null ? String(aiDraft.max_age) : "",
        participation_fee: aiDraft.participation_fee ?? "",
      });
      setIsAiDraft(true);
    } catch {
      setParseError("Nuk u lidha dot me AI. Provo përsëri.");
    } finally {
      setParsing(false);
    }
  }

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function handleConfirm() {
    if (!draft) return;
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("opportunities").insert({
      ...draft,
      deadline: draft.deadline || null,
      link: draft.link || null,
      min_age: draft.min_age ? parseInt(draft.min_age, 10) : null,
      max_age: draft.max_age ? parseInt(draft.max_age, 10) : null,
      participation_fee: draft.participation_fee || null,
      submitted_by: userId,
      status: "pending",
    });

    setSubmitting(false);
    if (error) {
      setSubmitError(error.message);
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

  // Step 1: paste raw text, let AI draft it
  if (!draft) {
    return (
      <div>
        <div className="mb-6 rounded-2xl border-2 border-acid/30 bg-acid/5 p-6">
          <p className="mb-3 text-sm font-bold text-acid">✨ Mënyra e shpejtë</p>
          <p className="mb-4 text-sm text-inksoft">
            Ngjit tekstin e një postimi (p.sh. nga Instagram) — AI e kthen në
            një mundësi të gatshme për t&apos;u shqyrtuar.
          </p>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={6}
            placeholder="Ngjit këtu tekstin e postimit..."
            className={inputClass}
          />
          {parseError && <p className="mt-3 text-sm text-pink">{parseError}</p>}
          <button
            onClick={handleParse}
            disabled={parsing || rawText.trim().length < 10}
            className="btn-primary mt-4 justify-center"
          >
            {parsing ? "Duke analizuar..." : "Analizo me AI ✨"}
          </button>
        </div>

        <button
          onClick={() => setDraft(EMPTY_DRAFT)}
          className="text-sm text-inkdim underline hover:text-inksoft"
        >
          Ose plotëso manualisht →
        </button>
      </div>
    );
  }

  // Step 2: review/edit fields (either AI-drafted or blank manual) before confirming
  return (
    <div>
      {isAiDraft && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-acid/10 px-4 py-2 text-sm font-semibold text-acid">
          ✨ Draft nga AI — kontrollo dhe redakto para se ta dërgosh
        </p>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-inksoft">Kategoria</label>
          <select
            value={draft.category}
            onChange={(e) => updateDraft("category", e.target.value as Category)}
            className={inputClass}
          >
            <option value="volunteering">Vullnetarizëm</option>
            <option value="erasmus">Erasmus+</option>
            <option value="ngo">Aktivitet OJQ</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={draft.title_al}
            onChange={(e) => updateDraft("title_al", e.target.value)}
            placeholder="Titulli (shqip)"
            className={inputClass}
          />
          <input
            value={draft.title_en}
            onChange={(e) => updateDraft("title_en", e.target.value)}
            placeholder="Title (English)"
            className={inputClass}
          />
        </div>

        <input
          value={draft.org}
          onChange={(e) => updateDraft("org", e.target.value)}
          placeholder="Emri i organizatës"
          className={inputClass}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={draft.location_al}
            onChange={(e) => updateDraft("location_al", e.target.value)}
            placeholder="Vendndodhja (shqip)"
            className={inputClass}
          />
          <input
            value={draft.location_en}
            onChange={(e) => updateDraft("location_en", e.target.value)}
            placeholder="Location (English)"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-inksoft">
            Afati (lëre bosh nëse është i hapur)
          </label>
          <input
            type="date"
            value={draft.deadline}
            onChange={(e) => updateDraft("deadline", e.target.value)}
            className={inputClass}
          />
        </div>

        <textarea
          value={draft.description_al}
          onChange={(e) => updateDraft("description_al", e.target.value)}
          rows={3}
          placeholder="Përshkrimi (shqip)"
          className={inputClass}
        />
        <textarea
          value={draft.description_en}
          onChange={(e) => updateDraft("description_en", e.target.value)}
          rows={3}
          placeholder="Description (English)"
          className={inputClass}
        />

        <input
          value={draft.link}
          onChange={(e) => updateDraft("link", e.target.value)}
          type="url"
          placeholder="Link për aplikim (opsionale)"
          className={inputClass}
        />

        <div className="rounded-xl border-2 border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-inkdim">
            Kushtet e pranueshmërisë (opsionale, por ndihmon shumë)
          </p>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <input
              type="number"
              value={draft.min_age}
              onChange={(e) => updateDraft("min_age", e.target.value)}
              placeholder="Mosha minimale"
              className={inputClass}
            />
            <input
              type="number"
              value={draft.max_age}
              onChange={(e) => updateDraft("max_age", e.target.value)}
              placeholder="Mosha maksimale"
              className={inputClass}
            />
          </div>

          <input
            value={draft.participation_fee}
            onChange={(e) => updateDraft("participation_fee", e.target.value)}
            placeholder="Tarifa pjesëmarrjeje (p.sh. €0, Falas, €50)"
            className={`${inputClass} mb-4`}
          />

          <div className="flex flex-wrap gap-4 text-sm text-inksoft">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.requires_experience}
                onChange={(e) => updateDraft("requires_experience", e.target.checked)}
              />
              Kërkon përvojë
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.travel_funded}
                onChange={(e) => updateDraft("travel_funded", e.target.checked)}
              />
              Udhëtimi i mbuluar
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.accommodation_funded}
                onChange={(e) => updateDraft("accommodation_funded", e.target.checked)}
              />
              Akomodimi i mbuluar
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.food_funded}
                onChange={(e) => updateDraft("food_funded", e.target.checked)}
              />
              Ushqimi i mbuluar
            </label>
          </div>
        </div>

        {submitError && <p className="text-sm text-pink">{submitError}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setDraft(null);
              setIsAiDraft(false);
              setRawText("");
            }}
            className="btn-ghost"
            type="button"
          >
            Anulo
          </button>
          <button onClick={handleConfirm} disabled={submitting} className="btn-primary" type="button">
            {submitting ? "..." : "Konfirmo dhe dërgo"}
          </button>
        </div>
      </div>
    </div>
  );
}
