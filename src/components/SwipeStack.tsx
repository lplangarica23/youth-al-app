"use client";

import { useRef, useState } from "react";
import { Opportunity } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function burstConfetti(originX: number, originY: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#D4FF3D", "#FF2E93", "#FF6B2C", "#FFFFFF"];

  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.left = originX + "px";
    piece.style.top = originY + "px";
    piece.style.width = "8px";
    piece.style.height = "8px";
    piece.style.background = colors[i % colors.length];
    piece.style.pointerEvents = "none";
    piece.style.zIndex = "400";
    piece.style.transition = "transform 0.8s cubic-bezier(0.2,0.8,0.3,1), opacity 0.8s ease";
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 100;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;

    requestAnimationFrame(() => {
      piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`;
      piece.style.opacity = "0";
    });
    window.setTimeout(() => piece.remove(), 850);
  }
}

export default function SwipeStack({
  opportunities,
  userId,
}: {
  opportunities: Opportunity[];
  userId: string | null;
}) {
  const [queue, setQueue] = useState(() => shuffle(opportunities));
  const [saved, setSaved] = useState(0);
  const [streak, setStreak] = useState(0);
  const dragState = useRef<{ startX: number; startY: number; dragging: boolean }>({
    startX: 0,
    startY: 0,
    dragging: false,
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const top = queue[0];

  async function handleSwipe(direction: "left" | "right") {
    if (!top) return;
    const card = cardRef.current;
    if (card) {
      const flyX = direction === "right" ? 700 : -700;
      const rotate = direction === "right" ? 24 : -24;
      card.style.transition = "transform 0.4s cubic-bezier(0.25,0.8,0.4,1)";
      card.style.transform = `translate(${flyX}px, -30px) rotate(${rotate}deg)`;
    }

    if (direction === "right") {
      setSaved((s) => s + 1);
      setStreak((s) => s + 1);
      if (card) {
        const rect = card.getBoundingClientRect();
        burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      if (userId) {
        // Fire and forget — if this fails (e.g. offline), the swipe
        // still feels instant; a production version should retry/queue.
        await supabase
          .from("saved_opportunities")
          .insert({ user_id: userId, opportunity_id: top.id })
          .then(({ error }) => {
            if (error) console.error("Failed to save opportunity:", error.message);
          });
      }
    } else {
      setStreak(0);
    }

    window.setTimeout(() => {
      setQueue((q) => q.slice(1));
      if (card) card.style.transform = "";
    }, 200);
  }

  function onPointerDown(e: React.PointerEvent) {
    dragState.current = { startX: e.clientX, startY: e.clientY, dragging: true };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current.dragging || !cardRef.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    cardRef.current.style.transform = `translate(${dx}px, ${dy * 0.3}px) rotate(${dx * 0.06}deg)`;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragState.current.dragging || !cardRef.current) return;
    dragState.current.dragging = false;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 100) {
      handleSwipe(dx > 0 ? "right" : "left");
    } else {
      cardRef.current.style.transform = "";
    }
  }

  function restart() {
    setQueue(shuffle(opportunities));
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[420px] w-80">
        {!top ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-white/20 bg-panel p-6 text-center">
            <h3 className="mb-2 text-xl font-bold">I ke parë të gjitha!</h3>
            <p className="mb-4 text-sm text-inksoft">Rifillo për të parë përsëri.</p>
            <button onClick={restart} className="btn-primary">
              Rifillo
            </button>
          </div>
        ) : (
          <>
            {queue.slice(1, 3).reverse().map((op, i) => (
              <div
                key={op.id}
                className="absolute inset-0 rounded-2xl border-2 border-white/20 bg-panel"
                style={{
                  transform: `translateY(${(1 - i) * 10}px) scale(${1 - (1 - i) * 0.04})`,
                  zIndex: i,
                }}
              />
            ))}
            <div
              ref={cardRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="absolute inset-0 z-10 flex cursor-grab flex-col justify-end rounded-2xl border-2 border-white p-6 shadow-hard-lg active:cursor-grabbing"
              style={{ background: "#151515", touchAction: "none" }}
            >
              <h4 className="mb-1 text-xl font-bold">{top.title_al}</h4>
              <p className="mb-1 text-sm text-inksoft">{top.org}</p>
              <p className="text-xs text-inkdim">{top.location_al}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-7 flex gap-6">
        <button
          onClick={() => handleSwipe("left")}
          aria-label="Skip"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink text-2xl text-pink shadow-hard"
        >
          ✕
        </button>
        <button
          onClick={() => handleSwipe("right")}
          aria-label="Like"
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-acid text-2xl text-acid shadow-hard"
        >
          ♥
        </button>
      </div>

      <div className="mt-8 flex gap-10 text-center">
        <div>
          <div className="text-3xl font-extrabold text-acid">{saved}</div>
          <div className="text-xs uppercase tracking-wide text-inksoft">
            të ruajtura
          </div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-acid">{streak}</div>
          <div className="text-xs uppercase tracking-wide text-inksoft">
            streak 🔥
          </div>
        </div>
      </div>

      {!userId && (
        <p className="mt-6 max-w-xs text-center text-xs text-inkdim">
          Krijo një llogari që "të ruajturat" të mos humbasin kur mbyll faqen.
        </p>
      )}
    </div>
  );
}
