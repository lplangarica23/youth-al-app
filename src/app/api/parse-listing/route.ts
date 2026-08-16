import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You extract structured job/volunteering/opportunity listings from raw, messy social media post text (often Albanian, sometimes mixed Albanian/English, often with emoji and hashtags).

Rules:
- category: "erasmus" for international exchanges/travel/EU programs, "volunteering" for local unpaid community work, "ngo" for internships/jobs/NGO-run activities and events. If genuinely ambiguous, pick the closest fit — never invent a category outside these three.
- title_al / title_en: short, clear, a few words. Translate between Albanian and English as needed — if the source is only in one language, translate it into the other yourself.
- org: the organization name if mentioned; if truly not stated, use "E panjohur" / "Unknown".
- location_al / location_en: city name if mentioned, in each language; if not mentioned, use "Shqipëri" / "Albania".
- deadline: an ISO date string (YYYY-MM-DD) if a specific deadline is mentioned or reasonably inferable; otherwise omit it. Never guess a fake specific date.
- description_al / description_en: 1-3 sentences, cleaned up and professional, removing emoji/hashtag clutter but keeping the real information. Translate as needed so both languages are filled in properly.
- min_age / max_age: ONLY set these if an age requirement is explicitly stated in the text. Never infer or guess an age range from context. This matters: these fields get shown to users as hard eligibility facts, not implied ones.
- requires_experience: true only if the text explicitly asks for prior experience; otherwise false.
- travel_funded / accommodation_funded / food_funded: true only if the text explicitly says these are covered/funded/included; otherwise false. Do not assume funding that isn't stated.
- participation_fee: a short string like "€0", "Falas", or "€50" if a fee (or its absence) is explicitly mentioned; otherwise omit it.
- If the input text doesn't look like a real opportunity/job/volunteering post at all, still do your best to fill the shape reasonably rather than refusing — a human reviews every draft before it goes live. When genuinely unsure about any eligibility/funding field, omit it or use false rather than guessing — a human reviewer fills in gaps, you should never fabricate eligibility facts.`;

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    category: { type: SchemaType.STRING, enum: ["volunteering", "erasmus", "ngo"] },
    title_al: { type: SchemaType.STRING },
    title_en: { type: SchemaType.STRING },
    org: { type: SchemaType.STRING },
    location_al: { type: SchemaType.STRING },
    location_en: { type: SchemaType.STRING },
    deadline: { type: SchemaType.STRING, nullable: true },
    description_al: { type: SchemaType.STRING },
    description_en: { type: SchemaType.STRING },
    min_age: { type: SchemaType.NUMBER, nullable: true },
    max_age: { type: SchemaType.NUMBER, nullable: true },
    requires_experience: { type: SchemaType.BOOLEAN },
    travel_funded: { type: SchemaType.BOOLEAN },
    accommodation_funded: { type: SchemaType.BOOLEAN },
    food_funded: { type: SchemaType.BOOLEAN },
    participation_fee: { type: SchemaType.STRING, nullable: true },
  },
  required: [
    "category",
    "title_al",
    "title_en",
    "org",
    "location_al",
    "location_en",
    "description_al",
    "description_en",
  ],
};

export async function POST(request: Request) {
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

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI parsing nuk është konfiguruar (mungon GEMINI_API_KEY)." },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const result = await model.generateContent(text.slice(0, 4000));
    const parsed = JSON.parse(result.response.text());

    return NextResponse.json({ draft: parsed });
  } catch (err) {
    console.error("AI parse failed:", err);
    return NextResponse.json(
      { error: "AI nuk arriti të lexojë tekstin. Provo përsëri, ose plotëso manualisht." },
      { status: 500 }
    );
  }
}
