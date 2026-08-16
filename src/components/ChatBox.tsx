"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Opportunity } from "@/lib/types";
import { EligibilityProfile } from "@/lib/eligibility";
import OpportunityCard from "./OpportunityCard";

type Message = {
  role: "user" | "assistant";
  content: string;
  opportunities?: Opportunity[];
};

const STARTERS = [
  "Kërkoj punë si kamarier/e",
  "Dua të bëhem vullnetar",
  "Dua të udhëtoj në Europë këtë verë",
  "Nuk kam asnjë përvojë, çfarë mund të bëj?",
];

export default function ChatBox({
  userId,
  profile,
}: {
  userId: string | null;
  profile?: EligibilityProfile | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Diçka shkoi keq.");
        setLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, opportunities: data.opportunities ?? [] },
      ]);
    } catch {
      setError("Nuk u lidha dot. Provo përsëri.");
    } finally {
      setLoading(false);
    }
  }

  if (!userId) {
    return (
      <div className="rounded-2xl border-2 border-white/20 bg-panel p-8 text-center">
        <p className="mb-4 text-inksoft">
          Hyr në llogari për të biseduar me AI-në dhe për të marrë sugjerime të
          personalizuara.
        </p>
        <Link href="/login" className="btn-primary">
          Hyr
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {messages.length > 0 && (
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="text-xs font-semibold text-inkdim underline hover:text-inksoft"
          >
            ↻ Bisedë e re
          </button>
        </div>
      )}

      {messages.length === 0 && (
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {STARTERS.map((s) => (
            <button key={s} onClick={() => send(s)} className="chip text-sm">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex max-h-[55vh] flex-col gap-5 overflow-y-auto rounded-2xl border-2 border-white/10 bg-black/20 p-5">
        {messages.length === 0 && !loading && (
          <p className="py-8 text-center text-sm text-inkdim">
            Më thuaj çfarë kërkon, me fjalët e tua — jo domosdoshmërisht fjalë kyçe.
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-acid text-black font-semibold"
                    : "bg-panel border border-white/10 text-ink"
                }`}
              >
                {m.content}
              </div>
              {m.opportunities && m.opportunities.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {m.opportunities.map((op) => (
                    <OpportunityCard
                      key={op.id}
                      op={op}
                      profile={profile}
                      userId={userId}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/10 bg-panel px-4 py-3 text-sm text-inkdim">
              Duke menduar...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="mb-3 text-sm text-pink">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-stretch overflow-hidden rounded-2xl border-2 border-white/20 bg-panel focus-within:border-acid"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="p.sh. kam nevojë për një punë si kamarier..."
          className="flex-1 bg-transparent px-5 py-4 text-ink placeholder:text-inkdim focus:outline-none"
        />
        <button type="submit" disabled={loading} className="btn-primary m-2 rounded-xl">
          Dërgo
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-inkdim">
        Ose përdor{" "}
        <Link href="/search" className="underline hover:text-inksoft">
          kërkimin klasik
        </Link>{" "}
        me fjalë kyçe.
      </p>
    </div>
  );
}
