import { SupabaseClient } from "@supabase/supabase-js";

// Chosen conservatively: the free Gemini tier gives roughly 1,500
// requests/day total, SHARED across every user of the whole app. This
// cap protects that shared pool from being exhausted by one heavy or
// abusive user before anyone else gets to use the chat that day.
// Easy to raise later once there's a real, larger user base and a
// clearer sense of typical usage patterns.
const DAILY_AI_LIMIT = 40;

export async function checkAndConsumeRateLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("ai_calls_today, ai_calls_date")
    .eq("id", userId)
    .single();

  const today = new Date().toISOString().slice(0, 10);
  const isNewDay = profile?.ai_calls_date !== today;
  const currentCount = isNewDay ? 0 : (profile?.ai_calls_today ?? 0);

  if (currentCount >= DAILY_AI_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  const nextCount = currentCount + 1;
  await supabase
    .from("profiles")
    .update({ ai_calls_today: nextCount, ai_calls_date: today })
    .eq("id", userId);

  return { allowed: true, remaining: DAILY_AI_LIMIT - nextCount };
}
