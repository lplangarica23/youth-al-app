import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You extract structured job/volunteering/opportunity listings from raw, messy social media post text (often Albanian, sometimes mixed Albanian/English, often with emoji and hashtags).

Return ONLY valid JSON, no other text, matching exactly this shape:
{
  "category": "volunteering" | "erasmus" | "ngo",
  "title_al": string,
  "title_en": string,
  "org": string,
  "location_al": string,
  "location_en": string,
  "deadline": string | null,
  "description_al": string,
  "description_en": string,
  "min_age": number | null,
  "max_age": number | null,
  "requires_experience": boolean,
  "travel_funded": boolean,
  "accommodation_funded": boolean,
  "food_funded": boolean,
  "participation_fee": string | null
}

Rules:
- category: "erasmus" for international exchanges/travel/EU programs, "volunteering" for local unpaid community work, "ngo" for internships/jobs/NGO-run activities and events. If genuinely ambiguous, pick the closest fit — never invent a category outside these three.
- title_al / title_en: short, clear, a few words. Translate between Albanian and English as needed — if the source is only in one language, translate it into the other yourself.
- org: the organization name if mentioned; if truly not stated, use "E panjohur" / "Unknown".
- location_al / location_en: city name if mentioned, in each language; if not mentioned, use "Shqipëri" / "Albania".
- deadline: an ISO date string (YYYY-MM-DD) if a specific deadline is mentioned or reasonably inferable; otherwise null. Never guess a fake specific date — use null when unsure.
- description_al / description_en: 1-3 sentences, cleaned up and professional, removing emoji/hashtag clutter but keeping the real information. Translate as needed so both languages are filled in properly.
- min_age / max_age: ONLY set these if an age requirement is explicitly stated in the text. Never infer or guess an age range from context — use null for both if not explicitly mentioned. This matters: these fields get shown to users as hard eligibility facts, not implied ones.
- requires_experience: true only if the text explicitly asks for prior experience; otherwise false.
- travel_funded / accommodation_funded / food_funded: true only if the text explicitly says these are covered/funded/included; otherwise false. Do not assume funding that isn't stated.
- participation_fee: a short string like "€0", "Falas", or "€50" if a fee (or its absence) is explicitly mentioned; otherwise null.
- If the input text doesn't look like a real opportunity/job/volunteering post at all, still do your best to fill the shape reasonably rather than refusing — a human reviews every draft before it goes live, so an imperfect draft is fine, but you must always return valid JSON in the exact shape above. When genuinely unsure about any eligibility/funding field, use null or false rather than guessing — a human reviewer fills in gaps, the AI should never fabricate eligibility facts.`;

export async function POST(request: Request) {
  // Require login — this costs real money per call, so it shouldn't be
  // reachable by anonymous visitors.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet të jesh i loguar." }, { status: 401 });
  }

  const { text } = await request.json();
  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return NextResponse.json(
      { error: "Ngjit më shumë tekst — duket shumë e shkurtër." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI parsing nuk është konfiguruar (mungon ANTHROPIC_API_KEY)." },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await anthropic.messages.create({
      // Haiku is deliberately used here instead of Sonnet/Opus — this is
      // a structured-extraction task, not complex reasoning, and Haiku
      // handles it fine at a fraction of the cost per call.
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text.slice(0, 4000) }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    if (!raw.trim()) {
      throw new Error(
        `No text content in AI response (got block types: ${message.content.map((b) => b.type).join(", ")})`
      );
    }
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1 || end < start) {
      throw new Error(`No JSON object found in AI response: ${raw.slice(0, 300)}`);
    }
    const cleaned = raw.slice(start, end + 1);
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ draft: parsed });
  } catch (err) {
    console.error("AI parse failed:", err);
    return NextResponse.json(
      { error: "AI nuk arriti të lexojë tekstin. Provo përsëri, ose plotëso manualisht." },
      { status: 500 }
    );
  }
}
