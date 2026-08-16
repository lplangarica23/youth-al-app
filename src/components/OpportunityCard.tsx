import { Opportunity } from "@/lib/types";
import { checkEligibility, EligibilityProfile, VERIFICATION_LABELS } from "@/lib/eligibility";
import SaveButton from "./SaveButton";

const CATEGORY_STYLES: Record<string, string> = {
  volunteering: "border-acid text-acid bg-acid/10",
  erasmus: "border-pink text-pink bg-pink/10",
  ngo: "border-orange text-orange bg-orange/10",
};

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Afat i hapur";
  return new Date(deadline).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OpportunityCard({
  op,
  reason,
  profile,
  userId,
  initiallySaved,
}: {
  op: Opportunity;
  reason?: string | null;
  profile?: EligibilityProfile | null;
  userId?: string | null;
  initiallySaved?: boolean;
}) {
  const verification = VERIFICATION_LABELS[op.verification_status] ?? VERIFICATION_LABELS.needs_verification;
  const eligibility = profile ? checkEligibility(op, profile) : null;

  const fundingBadges = [
    op.travel_funded && "✈️ Udhëtimi",
    op.accommodation_funded && "🏠 Akomodimi",
    op.food_funded && "🍽️ Ushqimi",
  ].filter(Boolean) as string[];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border-2 border-white/20 bg-panel">
      <div className="flex items-start justify-between gap-3 p-6 pb-4">
        <div className="flex gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-lg font-bold ${CATEGORY_STYLES[op.category]}`}
          >
            {op.category === "volunteering" ? "V" : op.category === "erasmus" ? "E" : "N"}
          </div>
          <div>
            <h3 className="text-lg font-bold leading-snug">{op.title_al}</h3>
            <p className="text-sm text-inksoft">{op.org}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <SaveButton
            opportunityId={op.id}
            initiallySaved={!!initiallySaved}
            userId={userId ?? null}
          />
          <span
            title={
              op.last_verified_at
                ? `Verifikuar më ${new Date(op.last_verified_at).toLocaleDateString("sq-AL")}`
                : undefined
            }
            className={`flex items-center gap-1 whitespace-nowrap text-xs font-bold ${verification.className}`}
          >
            {verification.emoji} {verification.label}
          </span>
        </div>
      </div>

      {reason && (
        <p className="mx-6 mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-acid/10 px-3 py-1 text-xs font-semibold text-acid">
          ✨ {reason}
        </p>
      )}

      <p className="px-6 pb-4 text-sm text-inksoft">{op.description_al}</p>

      {fundingBadges.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 px-6">
          {fundingBadges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-inksoft"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      {eligibility && eligibility.checks.length > 0 && (
        <div className="mx-6 mb-4 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-inkdim">
            Përse të përshtatet ({eligibility.matchPercent}%)
          </p>
          <ul className="flex flex-col gap-1">
            {eligibility.checks.map((c) => (
              <li
                key={c.label}
                className={`flex items-center gap-2 text-xs ${c.passed ? "text-acid" : "text-pink"}`}
              >
                <span>{c.passed ? "✓" : "✕"}</span> {c.label}
              </li>
            ))}
          </ul>
          {eligibility.warning && (
            <p className="mt-2 text-xs text-orange">⚠️ {eligibility.warning}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t-2 border-dashed border-white/20 px-6 py-4 text-sm text-inksoft">
        <span>{op.location_al}</span>
        <span className="font-bold text-ink">{formatDeadline(op.deadline)}</span>
      </div>
      <a
        href={op.link ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-ink py-4 text-center text-sm font-extrabold text-black hover:bg-acid"
      >
        Apliko
      </a>
    </article>
  );
}
