import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { Opportunity } from "@/lib/types";

const SYSTEM_PROMPT = `You are the youth.al assistant, helping young Albanians find real opportunities (volunteering, Erasmus+/jobs, NGO activities). You speak Albanian, warmly and simply, like a helpful friend — not a corporate chatbot.

You will be given a JSON list called AVAILABLE_OPPORTUNITIES containing the ONLY real opportunities that exist right now. This is your entire source of truth.

Hard rules, never break these:
- NEVER mention, describe, or imply the existence of any opportunity that is not in AVAILABLE_OPPORTUNITIES. Do not invent organizations, deadlines, funding details, or links. If nothing in the list genuinely fits what the person is asking for, say so honestly in Albanian and suggest they check back later or browse everything — do not stretch a bad match to seem good.
- Every opportunity you recommend must be referenced by its exact "id" from the list, in the opportunity_ids array. Never reference an id that isn't in the list.
- Recommend at most 5 opportunities, ranked by actual fit, not just the first ones you see.
- If the person's message isn't really about finding an opportunity (small talk, an unrelated question), respond warmly and briefly, and gently steer back to what they might be looking for — with an empty opportunity_ids array if nothing fits.
- Keep replies short — 2-4 sentences. This is a chat, not an essay.

This applies to every single message in the conversation, including casual or slangy follow-ups like "does this one fit me?" or "anything else?" — always respond with the same JSON shape, never with plain conversational text, no matter how informal the person's message is.

Respond ONLY with valid JSON, no other text, in exactly this shape:
{
  "reply_al": string,
  "opportunity_ids": string[]
}`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gated behind login — this makes a real, paid API call per message,
  // and an open endpoint is an easy target for automated abuse.
  if (!user) {
    return NextResponse.json({ error: "Duhet të jesh i loguar." }, { status: 401 });
  }

  const { message, history } = await request.json();
  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Mesazhi është bosh." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI chat nuk është konfiguruar (mungon ANTHROPIC_API_KEY)." },
      { status: 500 }
    );
  }

  // Fetch the real, current catalog. At today's small scale, sending
  // the whole approved list as context is simple and works well. As
  // the catalog grows into the hundreds/thousands, this should become
  // a retrieval step (e.g. pre-filter by category/text search first)
  // rather than sending everything on every message — a real scaling
  // task for later, not a problem yet at launch size.
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .eq("status", "approved")
    .limit(200);

  const catalog = ((opportunities as Opportunity[]) ?? []).map((op) => ({
    id: op.id,
    category: op.category,
    title_al: op.title_al,
    org: op.org,
    location_al: op.location_al,
    deadline: op.deadline,
    min_age: op.min_age,
    max_age: op.max_age,
    requires_experience: op.requires_experience,
    travel_funded: op.travel_funded,
    accommodation_funded: op.accommodation_funded,
    food_funded: op.food_funded,
    participation_fee: op.participation_fee,
    description_al: op.description_al?.slice(0, 200),
  }));

  // Light personalization context, same fields the rest of the app uses.
  const { data: profile } = await supabase
    .from("profiles")
    .select("interests, city, age, experience_level")
    .eq("id", user.id)
    .single();

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const conversationHistory = Array.isArray(history)
    ? history.slice(-10).map((h: { role: string; content: string }) => ({
        role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: h.content,
      }))
    : [];

  try {
    const aiResponse = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 700,
      system: `${SYSTEM_PROMPT}\n\nAVAILABLE_OPPORTUNITIES:\n${JSON.stringify(catalog)}\n\nUSER_PROFILE (may be incomplete):\n${JSON.stringify(profile ?? {})}`,
      messages: [...conversationHistory, { role: "user", content: message.slice(0, 1000) }],
    });

    const textBlock = aiResponse.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    if (!raw.trim()) {
      throw new Error(
        `No text content in AI response (got block types: ${aiResponse.content.map((b) => b.type).join(", ")})`
      );
    }
    // Extract the JSON object between the first { and last } — more
    // robust than stripping markdown fences, since it also handles the
    // model adding a stray sentence before/after the JSON despite
    // instructions not to, which fence-stripping alone doesn't cover.
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    let parsed: { reply_al: string; opportunity_ids: string[] };
    if (start === -1 || end === -1 || end < start) {
      // The model responded in plain text instead of JSON (can happen
      // on casual/slangy follow-ups). Rather than hard-failing the
      // whole chat, degrade gracefully: show its plain-text reply as
      // the message, just without any recommended cards attached.
      console.warn("No JSON object found, falling back to plain text:", raw.slice(0, 300));
      parsed = { reply_al: raw.trim(), opportunity_ids: [] };
    } else {
      const cleaned = raw.slice(start, end + 1);
      try {
        parsed = JSON.parse(cleaned) as { reply_al: string; opportunity_ids: string[] };
      } catch (parseErr) {
        console.warn("JSON.parse failed, falling back to plain text:", raw.slice(0, 300), parseErr);
        parsed = { reply_al: raw.trim(), opportunity_ids: [] };
      }
    }

    // Safety filter: only ever return opportunities that are actually in
    // our fetched catalog, even if the model somehow returns a bad id.
    const validIds = new Set(catalog.map((c) => c.id));
    const safeIds = (parsed.opportunity_ids ?? []).filter((id) => validIds.has(id));
    const fullOpportunities = ((opportunities as Opportunity[]) ?? []).filter((op) =>
      safeIds.includes(op.id)
    );

    return NextResponse.json({
      reply: parsed.reply_al,
      opportunities: fullOpportunities,
    });
  } catch (err) {
    console.error("Chat failed:", err);
    return NextResponse.json(
      { error: "Diçka shkoi keq. Provo përsëri." },
      { status: 500 }
    );
  }
}
