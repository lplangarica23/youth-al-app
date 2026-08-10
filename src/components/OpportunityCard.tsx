import { Opportunity, CATEGORY_LABELS } from "@/lib/types";

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

export default function OpportunityCard({ op }: { op: Opportunity }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border-2 border-white/20 bg-panel">
      <div className="flex gap-4 p-6 pb-4">
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
      <p className="px-6 pb-5 text-sm text-inksoft">{op.description_al}</p>
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
