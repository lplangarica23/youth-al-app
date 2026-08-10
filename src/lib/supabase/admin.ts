import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// DANGER: this uses the service_role key, which bypasses all Row Level
// Security rules. Only ever import this inside server-only code (Server
// Actions, Route Handlers) that has already checked the user is an
// admin — never in a Client Component, and never send this key to
// the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Simple allow-list based on email. Set ADMIN_EMAILS in .env.local as a
// comma-separated list, e.g. ADMIN_EMAILS=you@example.com,friend@example.com
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
