"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Opportunity } from "@/lib/types";

type ApplicationStatus = "saved" | "applying" | "applied";

const STATUS_STEPS: { key: ApplicationStatus; label: string; emoji: string }[] = [
  { key: "saved", label: "Ruajtur", emoji: "🔖" },
  { key: "applying", label: "Duke aplikuar", emoji: "✍️" },
  { key: "applied", label: "Aplikuar", emoji: "✅" },
];

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Afat i hapur";
  return new Date(deadline).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SavedList({
  items,
}: {
  items: { application_status: ApplicationStatus; opportunities: Opportunity }[];
}) {
  const supabase = createClient();
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>(
    Object.fromEntries(items.map((i) => [i.opportunities.id, i.application_status]))
  );
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  async function updateStatus(opportunityId: string, status: ApplicationStatus) {
    setStatuses((prev) => ({ ...prev, [opportunityId]: status }));
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("saved_opportunities")
      .update({ application_status: status })
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunityId);
  }

  async function unsave(opportunityId: string) {
    setRemoved((prev) => new Set(prev).add(opportunityId));
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunityId);
  }

  const visibleItems = items.filter((i) => !removed.has(i.opportunities.id));

  if (visibleItems.length === 0) {
    return <p className="py-16 text-center text-inksoft">I ke hequr të gjitha nga lista.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {visibleItems.map(({ opportunities: op }) => {
        const status = statuses[op.id] ?? "saved";
        return (
          <div key={op.id} className="rounded-2xl border-2 border-white/20 bg-panel p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{op.title_al}</h3>
                <p className="text-sm text-inksoft">
                  {op.org} · {op.location_al} · {formatDeadline(op.deadline)}
                </p>
              </div>
              <button
                onClick={() => unsave(op.id)}
                className="shrink-0 text-xs text-inkdim underline hover:text-pink"
              >
                Hiq
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_STEPS.map((step) => (
                <button
                  key={step.key}
                  onClick={() => updateStatus(op.id, step.key)}
                  className={`chip text-sm ${status === step.key ? "active" : ""}`}
                >
                  {step.emoji} {step.label}
                </button>
              ))}
            </div>

            {op.link && (
              <a
                href={op.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-bold text-acid underline"
              >
                Shko te aplikimi →
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
