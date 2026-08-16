import { Opportunity, Category } from "./types";

export type EligibilityProfile = {
  age: number | null;
  experience_level: "none" | "some" | "experienced" | null;
  interests: Category[] | null;
};

export type EligibilityCheck = {
  label: string;
  passed: boolean;
};

export type EligibilityResult = {
  checks: EligibilityCheck[];
  warning: string | null;
  matchPercent: number;
};

// Deterministic, explainable eligibility check. Every line here is a
// real structured comparison — never an LLM guessing whether someone
// "seems eligible." This is the safety principle from the strategy
// doc (Section 9 and Section 32): AI explains structured facts, it
// doesn't invent them.
export function checkEligibility(
  op: Opportunity,
  profile: EligibilityProfile | null
): EligibilityResult {
  const checks: EligibilityCheck[] = [];
  let warning: string | null = null;

  if (!profile) {
    return { checks: [], warning: null, matchPercent: 0 };
  }

  // Age range
  if (op.min_age != null || op.max_age != null) {
    if (profile.age == null) {
      warning = "Shto moshën tënde te profili për të parë nëse plotëson kushtet.";
    } else {
      const min = op.min_age ?? 0;
      const max = op.max_age ?? 200;
      const fits = profile.age >= min && profile.age <= max;
      checks.push({
        label: `Mosha ${min}${op.max_age ? `–${max}` : "+"}`,
        passed: fits,
      });
      if (!fits) {
        warning = `Kjo mundësi kërkon moshë ${min}${op.max_age ? `–${max}` : "+"}.`;
      }
    }
  }

  // Experience requirement
  if (op.requires_experience) {
    const hasExperience = profile.experience_level === "some" || profile.experience_level === "experienced";
    checks.push({ label: "Kërkon përvojë të mëparshme", passed: hasExperience });
    if (!hasExperience && !warning) {
      warning = "Kjo mundësi zakonisht kërkon përvojë të mëparshme.";
    }
  } else {
    checks.push({ label: "Nuk kërkohet përvojë e mëparshme", passed: true });
  }

  // Interest/category match
  if (profile.interests?.length) {
    const matches = profile.interests.includes(op.category);
    checks.push({ label: "Përputhet me interesat e tua", passed: matches });
  }

  const passedCount = checks.filter((c) => c.passed).length;
  const matchPercent = checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 0;

  return { checks, warning, matchPercent };
}

export const VERIFICATION_LABELS: Record<
  string,
  { label: string; emoji: string; className: string }
> = {
  verified: { label: "E verifikuar", emoji: "🟢", className: "text-acid" },
  needs_verification: { label: "Në verifikim", emoji: "🟡", className: "text-inksoft" },
  expired: { label: "Ka skaduar", emoji: "🔴", className: "text-pink" },
  community_reported: { label: "Raportuar nga përdorues", emoji: "⚠️", className: "text-orange" },
};
