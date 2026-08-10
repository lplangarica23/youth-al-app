import { createBrowserClient } from "@supabase/ssr";

// Used inside Client Components ("use client" files) — anything that
// runs in the browser, like the Swipe Mode drag handlers or the
// login form.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
