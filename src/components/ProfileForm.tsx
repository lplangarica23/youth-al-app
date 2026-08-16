"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/lib/types";

const INTERESTS: { key: Category; label: string; emoji: string }[] = [
  { key: "volunteering", label: "Vullnetarizëm", emoji: "💚" },
  { key: "erasmus", label: "Erasmus+ / Punë", emoji: "✈️" },
  { key: "ngo", label: "Aktivitete OJQ", emoji: "🤝" },
];

const CITIES = ["Tiranë", "Durrës", "Shkodër", "Vlorë", "Korçë", "Tjetër"];

const EXPERIENCE_LEVELS: { key: "none" | "some" | "experienced"; label: string }[] = [
  { key: "none", label: "Asnjë përvojë ndërkombëtare ende" },
  { key: "some", label: "Pak përvojë (1-2 aktivitete)" },
  { key: "experienced", label: "Përvojë e konsiderueshme" },
];

type ProfileData = {
  full_name: string | null;
  city: string | null;
  interests: Category[] | null;
  purpose: string | null;
  age: number | null;
  experience_level: "none" | "some" | "experienced" | null;
  avatar_url: string | null;
};

export default function ProfileForm({
  userId,
  email,
  initial,
}: {
  userId: string;
  email: string;
  initial: ProfileData | null;
}) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [city, setCity] = useState<string | null>(initial?.city ?? null);
  const [interests, setInterests] = useState<Category[]>(initial?.interests ?? []);
  const [age, setAge] = useState<string>(initial?.age?.toString() ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial?.avatar_url ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<"none" | "some" | "experienced" | null>(
    initial?.experience_level ?? null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(key: Category) {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Zgjidh një skedar imazhi (JPG, PNG, etj.)");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setAvatarError("Imazhi duhet të jetë nën 3MB.");
      return;
    }

    setUploadingAvatar(true);
    setAvatarError(null);

    // Stored under a folder named with the user's own ID — the storage
    // RLS policies only allow uploading into your own folder, so this
    // path structure is what actually enforces "only you can change
    // your own avatar," not just the UI.
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setAvatarError(uploadError.message);
      setUploadingAvatar(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const newUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: newUrl })
      .eq("id", userId);

    setUploadingAvatar(false);
    if (updateError) {
      setAvatarError(updateError.message);
      return;
    }
    setAvatarUrl(newUrl);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || null,
        city,
        interests,
        age: age ? parseInt(age, 10) : null,
        experience_level: experienceLevel,
      })
      .eq("id", userId);

    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  const inputClass =
    "w-full rounded-xl border-2 border-white/20 bg-panel px-4 py-3 text-ink placeholder:text-inkdim focus:border-acid focus:outline-none";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm font-bold text-inksoft">Foto e profilit</p>
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-panel">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <label className="btn-ghost cursor-pointer text-sm">
              {uploadingAvatar ? "Duke ngarkuar..." : "Ndrysho foton"}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
            {avatarError && <p className="mt-2 text-xs text-pink">{avatarError}</p>}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-bold text-inksoft">Email</p>
        <p className="text-inkdim">{email}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-inksoft">Emri</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Emri yt"
          className={inputClass}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-inksoft">Ku ndodhesh?</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`chip ${city === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-inksoft">Çfarë të intereson?</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <button
              key={i.key}
              onClick={() => toggleInterest(i.key)}
              className={`chip ${interests.includes(i.key) ? "active" : ""}`}
            >
              <span className="mr-1">{i.emoji}</span> {i.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-inksoft">Mosha</label>
        <input
          type="number"
          min={14}
          max={100}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="p.sh. 21"
          className={`${inputClass} max-w-[160px]`}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-inksoft">Përvoja ndërkombëtare</p>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_LEVELS.map((e) => (
            <button
              key={e.key}
              onClick={() => setExperienceLevel(e.key)}
              className={`chip justify-start ${experienceLevel === e.key ? "active" : ""}`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-pink">{error}</p>}

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "..." : "Ruaj ndryshimet"}
        </button>
        {saved && <span className="text-sm font-semibold text-acid">✓ U ruajt</span>}
      </div>
    </div>
  );
}
