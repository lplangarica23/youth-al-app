import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-white/15 bg-black/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          youth<span className="text-acid">.al</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-inksoft md:flex">
          <Link href="/opportunities" className="hover:text-ink">
            Mundësitë
          </Link>
          <Link href="/swipe" className="hover:text-ink">
            Swipe Mode
          </Link>
          <Link href="/submit" className="hover:text-ink">
            Shto Mundësi
          </Link>
        </div>

        {user ? (
          <form action="/auth/signout" method="post">
            <button className="btn-ghost" type="submit">
              {user.email?.split("@")[0]}, dil
            </button>
          </form>
        ) : (
          <Link href="/login" className="btn-primary">
            Fillo
          </Link>
        )}
      </nav>
    </header>
  );
}
