import Link from "next/link";
import AmbientBlobs from "@/components/AmbientBlobs";
import Marquee from "@/components/Marquee";
import CursorGlow from "@/components/CursorGlow";
import Reveal from "@/components/Reveal";

const PILLARS = [
  {
    title: "Mundësi",
    text: "Vullnetarizëm, Erasmus+ dhe aktivitete nga OJQ.",
    tag: "LIVE",
    live: true,
  },
  {
    title: "Miqësi & Takime",
    text: "Takohu me të rinj si ti, në evente dhe grupe lokale.",
    tag: "SË SHPEJTI",
    live: false,
  },
  {
    title: "Udhëto Bashkë",
    text: "Gjej shokë udhëtimi për trip-in tënd të radhës.",
    tag: "SË SHPEJTI",
    live: false,
  },
  {
    title: "Gjej Shtëpi",
    text: "Shtëpi dhe cimera për studentë, në qytetin tënd.",
    tag: "SË SHPEJTI",
    live: false,
  },
  {
    title: "Shpërndaj",
    text: "Nda libra, sende dhe kosto me studentë të tjerë.",
    tag: "SË SHPEJTI",
    live: false,
  },
];

export default function HomePage() {
  return (
    <main>
      <CursorGlow />

      <section
        id="hero-section"
        className="relative overflow-hidden px-6 pb-16 pt-28 text-center"
      >
        <AmbientBlobs />

        <div className="relative z-10">
          <p className="entrance entrance-1 mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-inksoft">
            <span className="h-2 w-2 rounded-full bg-acid shadow-[0_0_12px_#d4ff3d]" />
            Platforma #1 për rininë shqiptare
          </p>
          <h1 className="entrance entrance-2 mx-auto max-w-3xl text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">
            Ku rinia shqiptare gjen gjithçka.
          </h1>
          <p className="entrance entrance-3 mx-auto mt-6 max-w-lg text-lg font-medium text-inksoft">
            Mundësi, miq, udhëtime, shtëpi — një platformë, gjithçka.
          </p>
          <div className="entrance entrance-4 mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/opportunities" className="btn-primary">
              Fillo tani
            </Link>
            <Link href="/swipe" className="btn-ghost">
              Provo lojën 🔥
            </Link>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="mx-auto max-w-6xl px-6 py-20" id="pillars">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-inksoft">
          Kush jemi
        </p>
        <h2 className="mb-10 text-3xl font-extrabold sm:text-4xl">
          Gjithçka në një app
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="relative h-full rounded-2xl border-2 border-white/20 bg-panel p-7 transition-transform hover:-translate-y-1">
                <span
                  className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${
                    p.live
                      ? "bg-acid text-black"
                      : "border border-inkdim text-inkdim"
                  }`}
                >
                  {p.tag}
                </span>
                <h3 className="mb-2 text-xl font-bold">{p.title}</h3>
                <p className="text-sm text-inksoft">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-10 block text-center">
          <Link
            href="/submit"
            className="text-sm font-bold text-inksoft underline hover:text-acid"
          >
            Përfaqëson një OJQ? Shto një mundësi →
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
