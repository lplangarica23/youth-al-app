import { Opportunity, Category } from "./types";

export type Profile = {
  interests: Category[] | null;
  city: string | null;
  age?: number | null;
  experience_level?: "none" | "some" | "experienced" | null;
};

// A transparent, explainable scoring formula — not a trained model.
// Combines: how well the category matches the person's stated
// interests, how soon the deadline is, and what they've saved before.
// Deliberately simple enough to reason about and debug.
export function scoreOpportunity(
  op: Opportunity,
  profile: Profile | null,
  savedCategoryCounts: Partial<Record<Category, number>>
): { score: number; reason: string | null } {
  let score = 0;
  let reason: string | null = null;

  // Stated interest match (from onboarding)
  if (profile?.interests?.includes(op.category)) {
    score += 30;
    reason = "sepse tregove interes për këtë kategori";
  }

  // Age eligibility — genuine mismatches get pushed down, not hidden,
  // but not filtered out entirely (the person can still see and read it).
  if (profile?.age != null && (op.min_age != null || op.max_age != null)) {
    const min = op.min_age ?? 0;
    const max = op.max_age ?? 200;
    if (profile.age >= min && profile.age <= max) {
      score += 15;
    } else {
      score -= 25;
    }
  }

  // Experience requirement mismatch — same principle, visible but deprioritized.
  if (op.requires_experience && profile?.experience_level === "none") {
    score -= 15;
  }

  // Revealed preference: categories they've saved before
  const savedCount = savedCategoryCounts[op.category] ?? 0;
  if (savedCount > 0) {
    score += Math.min(savedCount * 8, 24);
    if (!reason) reason = "sepse ke ruajtur mundësi të ngjashme";
  }

  // Deadline urgency — sooner deadlines rank higher, rolling deadlines
  // get a small flat bonus rather than being ranked last.
  if (op.deadline) {
    const daysLeft = Math.ceil(
      (new Date(op.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft >= 0 && daysLeft <= 30) {
      score += Math.max(20 - daysLeft * 0.6, 2);
      if (daysLeft <= 5 && !reason) reason = "afati po mbyllet së shpejti";
    }
  } else {
    score += 4; // rolling deadline: small flat bonus, never penalized
  }

  // Small jitter so results don't feel robotically static between visits
  score += Math.random() * 3;

  return { score, reason };
}

export function rankOpportunities(
  opportunities: Opportunity[],
  profile: Profile | null,
  savedCategoryCounts: Partial<Record<Category, number>>
): { op: Opportunity; reason: string | null }[] {
  return opportunities
    .map((op) => {
      const { score, reason } = scoreOpportunity(op, profile, savedCategoryCounts);
      return { op, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ op, reason }) => ({ op, reason }));
}

// Turns a list of saved opportunities into { category: count }, used
// as the "revealed preference" signal above.
export function countSavedCategories(
  saved: { opportunities: { category: Category } | null }[]
): Partial<Record<Category, number>> {
  const counts: Partial<Record<Category, number>> = {};
  for (const row of saved) {
    const cat = row.opportunities?.category;
    if (!cat) continue;
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}
