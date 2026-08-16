"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/lib/types";

const INTERESTS: { key: Category; label: string; emoji: string }[] = [
  { key: "volunteering", label: "Vullnetarizëm", emoji: "💚" },
  { key: "erasmus", label: "Erasmus+ / Punë", emoji: "✈️" },
  { key: "ngo", label: "Aktivitete OJQ", emoji: "🤝" },
];

const CITIES = ["Tiranë", "Durrës", "Shkodër", "Vlorë", "Korçë", "Tjetër"];

const PURPOSES = [
  { key: "job", label: "Kërkoj punë ose praktikë" },
  { key: "volunteer", label: "Dua të bëhem vullnetar" },
  { key: "explore", label: "Po eksploroj çfarë ka" },
];

const EXPERIENCE_LEVELS: { key: "none" | "some" | "experienced"; label: string }[] = [
  { key: "none", label: "Asnjë përvojë ndërkombëtare ende" },
  { key: "some", label: "Pak përvojë (1-2 aktivitete)" },
  { key: "experienced", label: "Përvojë e konsiderueshme" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<Category[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [age, setAge] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<"none" | "some" | "experienced" | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleInterest(key: Category) {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  }

  async function finish() {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({
          interests,
          city,
          purpose,
          age: age ? parseInt(age, 10) : null,
          experience_level: experienceLevel,
        })
        .eq("id", user.id);
    }
    router.push("/");
    router.refresh();
  }

  const steps = [
    {
      title: "Çfarë të intereson?",
      sub: "Zgjidh aq sa dëshiron",
      content: (
        <div className="flex flex-wrap justify-center gap-3">
          {INTERESTS.map((i) => (
            <button
              key={i.key}
              onClick={() => toggleInterest(i.key)}
              className={`chip text-base ${interests.includes(i.key) ? "active" : ""}`}
            >
              <span className="mr-1">{i.emoji}</span> {i.label}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
    {
      title: "Ku ndodhesh?",
      sub: "Për të gjetur gjëra pranë teje",
      content: (
        <div className="flex flex-wrap justify-center gap-3">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`chip text-base ${city === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
    {
      title: "Çfarë të solli këtu?",
      sub: "Kjo na ndihmon të fillojmë mirë",
      content: (
        <div className="flex flex-col items-center gap-3">
          {PURPOSES.map((p) => (
            <button
              key={p.key}
              onClick={() => setPurpose(p.key)}
              className={`chip w-full max-w-xs justify-center text-base ${purpose === p.key ? "active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
    {
      title: "Sa vjeç je?",
      sub: "Për të kontrolluar kushtet e moshës në çdo mundësi",
      content: (
        <div className="mx-auto max-w-[160px]">
          <input
            type="number"
            min={14}
            max={100}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="p.sh. 21"
            className="w-full rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-center text-lg text-ink placeholder:text-inkdim focus:border-acid focus:outline-none"
          />
        </div>
      ),
      canNext: true,
    },
    {
      title: "Sa përvojë ndërkombëtare ke?",
      sub: "Disa mundësi kërkojnë përvojë të mëparshme",
      content: (
        <div className="flex flex-col items-center gap-3">
          {EXPERIENCE_LEVELS.map((e) => (
            <button
              key={e.key}
              onClick={() => setExperienceLevel(e.key)}
              className={`chip w-full max-w-xs justify-center text-base ${experienceLevel === e.key ? "active" : ""}`}
            >
              {e.label}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-10 rounded-full ${i <= step ? "bg-acid" : "bg-white/15"}`}
          />
        ))}
      </div>

      <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl">{current.title}</h1>
      <p className="mb-8 text-inksoft">{current.sub}</p>

      <div className="mb-10 w-full">{current.content}</div>

      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">
            Kthehu
          </button>
        )}
        {!isLast ? (
          <button onClick={() => setStep((s) => s + 1)} className="btn-primary">
            Vazhdo
          </button>
        ) : (
          <button onClick={finish} disabled={saving} className="btn-primary">
            {saving ? "..." : "Fillo"}
          </button>
        )}
      </div>

      <button
        onClick={finish}
        className="mt-6 text-sm text-inkdim underline hover:text-inksoft"
      >
        Kapërce për tani
      </button>
    </main>
  );
}
