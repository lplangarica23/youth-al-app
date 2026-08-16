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
  const abortRef = useRef<AbortController | null>(null);

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

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
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
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Nuk u lidha dot. Provo përsëri.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function cancel() {
    abortRef.current?.abort();
    setLoading(false);
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

      {/* aria-live: screen readers announce new AI replies as they arrive,
          without this the chat is effectively silent for assistive tech */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="mb-4 flex max-h-[55vh] flex-col gap-5 overflow-y-auto rounded-2xl border-2 border-white/10 bg-black/20 p-5"
      >
        {messages.length === 0 && !loading && (
          <p className="py-8 text-center text-sm text-inkdim">
            Më thuaj çfarë kërkon, me fjalët e tua — jo domosdoshmërisht fjalë kyçe.
          </p>
        )}

        {messages.map((m, i) => {
          const foundNothing =
            m.role === "assistant" && (!m.opportunities || m.opportunities.length === 0);
          return (
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
                {/* Escalation path: don't just say "nothing found" and stop
                    — always point somewhere useful next, per the research
                    finding that recovery paths matter more than the AI
                    being right every time. */}
                {foundNothing && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/opportunities" className="chip text-xs">
                      Shfleto të gjitha →
                    </Link>
                    <Link href="/submit" className="chip text-xs">
                      Nuk e gjete? Sugjero një mundësi →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-panel px-4 py-3 text-sm text-inkdim">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-inkdim [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-inkdim [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-inkdim" />
              </span>
              Duke menduar...
              <button
                onClick={cancel}
                className="ml-1 text-xs font-semibold text-pink underline hover:text-pink/80"
              >
                Anulo
              </button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p role="alert" className="mb-3 text-sm text-pink">
          {error}
        </p>
      )}

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
          aria-label="Shkruaj mesazhin tënd për AI-në"
          className="flex-1 bg-transparent px-5 py-4 text-ink placeholder:text-inkdim focus:outline-none"
        />
        <button type="submit" disabled={loading} className="btn-primary m-2 rounded-xl">
          Dërgo
        </button>
      </form>

      {/* Capability transparency, per UX research: users should know the
          AI's real limits before they hit them, not discover it through
          a bad answer. */}
      <p className="mt-3 text-center text-xs text-inkdim">
        AI-ja rekomandon vetëm mundësi që ekzistojnë realisht — por mund të
        gabojë. Gjithmonë verifiko me organizatën përpara se të vendosësh. Ose
        përdor{" "}
        <Link href="/search" className="underline hover:text-inksoft">
          kërkimin klasik
        </Link>{" "}
        me fjalë kyçe.
      </p>
    </div>
  );
}
