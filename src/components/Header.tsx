import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/search", label: "Kërko" },
  { href: "/swipe", label: "Swipe Mode" },
  { href: "/saved", label: "Të Ruajturat" },
  { href: "/opportunities", label: "Shfleto të gjitha" },
  { href: "/submit", label: "Shto Mundësi" },
];

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let avatarUrl: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    avatarUrl = profile?.avatar_url ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-white/15 bg-black/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          youth<span className="text-acid">.al</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold text-inksoft md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <details className="relative hidden md:block">
              <summary className="btn-ghost flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-panel-light">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "👤"
                  )}
                </span>
                {user.email?.split("@")[0]} ▾
              </summary>
              <div className="absolute right-0 top-[calc(100%+10px)] flex w-48 flex-col gap-1 rounded-2xl border-2 border-white/20 bg-panel p-3 shadow-[6px_6px_0_rgba(0,0,0,0.6)]">
                <Link
                  href="/profile"
                  className="rounded-lg px-3 py-2 font-semibold text-ink hover:bg-white/5"
                >
                  Profili
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    className="w-full rounded-lg px-3 py-2 text-left font-semibold text-pink hover:bg-white/5"
                    type="submit"
                  >
                    Dil
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link href="/login" className="hidden btn-primary md:inline-flex">
              Fillo
            </Link>
          )}

          {/* Mobile menu — native <details>, no client JS needed */}
          <details className="relative md:hidden">
            <summary aria-label="Hap menunë" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border-2 border-white/20 [&::-webkit-details-marker]:hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </summary>
            <div className="absolute right-0 top-[calc(100%+10px)] flex w-56 flex-col gap-1 rounded-2xl border-2 border-white/20 bg-panel p-3 shadow-[6px_6px_0_rgba(0,0,0,0.6)]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 font-semibold text-ink hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="rounded-lg px-3 py-2 font-semibold text-ink hover:bg-white/5"
                  >
                    Profili
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button className="btn-ghost mt-2 w-full justify-center" type="submit">
                      Dil
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="btn-primary mt-2 justify-center">
                  Fillo
                </Link>
              )}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
