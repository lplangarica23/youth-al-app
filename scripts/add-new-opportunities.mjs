// Real opportunities found and verified on 2026-08-16, formatted to match
// the exact shape used in scripts/seed.mjs and the `opportunities` table
// schema (supabase/schema.sql).
//
// IMPORTANT — read before uploading:
// - status is set to "pending", NOT "approved". These came from an AI web
//   search, not a human who confirmed the source firsthand — exactly the
//   case youth.al's own admin review queue exists for. A human should open
//   each `link` below, confirm the details are still accurate, and only
//   then approve it from /admin. Don't bulk-insert these as "approved".
// - verification_status is "needs_verification" for the same reason.
// - Two of these (RYCO Just Transition, EFB Common Ground grants) have
//   eligibility notes baked into the Albanian/English description that
//   are NOT simple "any 18-30 year old Albanian can apply" — read them
//   before publishing, don't strip that context out.
// - Albanian text below is a reasonable machine-assisted translation, not
//   reviewed by a native speaker — worth a quick polish pass before it's
//   public-facing.

export const NEW_OPPORTUNITIES = [
  {
    category: "erasmus",
    title_al: "Kurs Trajnimi: 'Shkëmbime Rinore për TË GJITHË' — Sllovaki",
    title_en: "Training Course: 'Youth Exchanges for ALL' — Slovakia",
    org: "SALTO Inclusion & Diversity Resource Centre / Slovak National Agency",
    location_al: "Sllovaki",
    location_en: "Slovakia",
    deadline: "2026-09-01",
    description_al:
      "Kurs trajnimi 5–9 tetor 2026 për punonjës rinorë, punonjës social dhe profesionistë të përfshirjes sociale, mbi organizimin e shkëmbimeve rinore gjithëpërfshirëse për të rinj me më pak mundësi. I krijuar posaçërisht për organizatorë pa përvojë të mëparshme — ata me përvojë këshillohen të kërkojnë kurse të tjera. Shqipëria është shprehimisht e pranueshme. Kërkohet takim online përgatitor më 18 shtator. Gjuha e punës: anglisht.",
    description_en:
      "A 5–9 October 2026 training course for youth workers, social workers, and inclusion professionals on organizing inclusive youth exchanges for young people with fewer opportunities. Explicitly designed for first-time organizers — those with prior mobility-project experience are advised to look for other courses. Albania is explicitly listed as eligible (Western Balkans + South-East Europe). Requires a pre-course online meeting on 18 September. Working language: English.",
    link: "https://www.salto-youth.net/tools/european-training-calendar/application-procedure/16338/",
    min_age: null,
    max_age: null,
    requires_experience: false,
    travel_funded: true,
    accommodation_funded: true,
    food_funded: true,
    participation_fee: "E panjohur (varion sipas vendit — kontrollo me Agjencinë Kombëtare)",
    verification_status: "needs_verification",
    status: "pending",
  },
  {
    category: "ngo",
    title_al: "Thirrje e Hapur: 'Rinia në Zemër të Tranzicionit të Drejtë'",
    title_en: "Open Call: 'Youth at the Heart of Just Transition'",
    org: "Regional Youth Cooperation Office (RYCO) & GIZ",
    location_al: "Manastir, Maqedonia e Veriut (trajnim rajonal)",
    location_en: "Bitola, North Macedonia (regional training)",
    deadline: "2026-08-27",
    description_al:
      "Trajnim rajonal 2.5-ditor dhe dialog politikash mbi tranzicionin energjitik të drejtë. E hapur për të rinj 18–30 vjeç nga Ballkani Perëndimor. KUJDES — kriter specifik eligjibiliteti: aplikuesit duhet të jetojnë, studiojnë, punojnë ose të kenë lidhje të fortë me një komunitet të prekur nga qymyri, minierat, industria, energjia ose tranzicioni — në Shqipëri kjo përfshin zona si Fier, Patos, Marinëz, Ballsh. Nuk është e hapur për çdo të ri shqiptar, vetëm për ata me këtë lidhje specifike. Kërkohet anglisht. Të gjitha kostot (udhëtim, akomodim, ushqim) mbulohen nga organizatorët.",
    description_en:
      "A 2.5-day regional training and policy dialogue on just energy transition. Open to 18–30 year-olds from the Western Balkans. IMPORTANT — specific eligibility: applicants must live, study, work in, or have a strong connection to a coal, mining, industrial, energy-producing or transition-affected community — in Albania this includes areas like Fier, Patos, Marinëz, Ballsh. This is NOT open to any young Albanian generally, only those with that specific connection. English required. All costs (travel, accommodation, meals) covered by the organisers.",
    link: "https://forms.cloud.microsoft/pages/responsepage.aspx?id=V0RQwZgbLk-h7GKA7M6qhJDQ8_D2yeVEntkfDTPB1llURDZGQ0tLS0JCREpLVUwwUDk0R01VQUszTS4u&route=shorturl",
    min_age: 18,
    max_age: 30,
    requires_experience: false,
    travel_funded: true,
    accommodation_funded: true,
    food_funded: true,
    participation_fee: "€0",
    verification_status: "needs_verification",
    status: "pending",
  },
  {
    category: "ngo",
    title_al: "Grante deri në €4,500 — Common Ground Program (Fondi Evropian për Ballkanin)",
    title_en: "Grants up to €4,500 — Common Ground Program (European Fund for the Balkans)",
    org: "European Fund for the Balkans (EFB)",
    location_al: "Ballkani Perëndimor (bazuar në projekt)",
    location_en: "Western Balkans (project-based)",
    deadline: "2026-11-02",
    description_al:
      "Grante deri në €4,500 për organizata të vogla lokale, kolektiva ose grupe joformale (\"ad hoc\") për projekte pilot, studime fatësueshmërie ose iniciativa dialogu komuniteti. 20 grante të disponueshme në 2026, aplikime pranohen vazhdimisht deri më 2 nëntor 2026 (rekomandohet aplikim i hershëm). KUJDES: faqja zyrtare nuk e përmend shprehimisht Shqipërinë ndër vendet e pranueshme (thotë vetëm \"Ballkani Perëndimor\") — konfirmo me email në cgp@balkanfund.org para se ta publikosh si të verifikuar. Gjithashtu, kjo u drejtohet organizatave/grupeve, jo domosdoshmërisht individëve.",
    description_en:
      "Grants up to €4,500 for small local organizations, collectives, or informal ('ad hoc') groups, for pilot projects, feasibility studies, or community dialogue initiatives. 20 grants available in 2026, rolling applications until 2 November 2026 (early submission encouraged). CAUTION: the official page doesn't explicitly name Albania among eligible countries (it just says 'Western Balkans') — confirm by emailing cgp@balkanfund.org before marking this verified. Also aimed at organizations/groups, not necessarily individuals applying alone.",
    link: "https://www.balkanfund.org/applications/cgp-opportunity-innovation-grants/apply",
    min_age: null,
    max_age: null,
    requires_experience: true,
    travel_funded: false,
    accommodation_funded: false,
    food_funded: false,
    participation_fee: "E panjohur",
    verification_status: "needs_verification",
    status: "pending",
  },
];

// Leads found but NOT included above because I couldn't verify a real
// deadline/link/Albania-eligibility with enough confidence to publish
// without fabricating details — worth a human spending 10 minutes on
// each before deciding whether to add them:
//
// 1. RYCO — Western Balkans Youth Cultural Fund (4th Open Call)
//    Grants €3,000 (individuals) / €6,000 (CSOs) for cultural activism,
//    Albania confirmed eligible (WB6), but no specific deadline was
//    published on the page I found. Contact office@rycowb.org or check
//    rycowb.org/westernbalkansyouthculturalfund/ directly for the current
//    call status.
//
// 2. Friedrich Naumann Foundation Scholarships (Master/PhD)
//    Deadline 31 Oct 2026, open to "all nationalities," but requires
//    German at B2 level and the application itself is in German —
//    real and fully funded, but only relevant to a narrow slice of
//    your users. https://www.freiheit.org/scholarships-friedrich-naumann-foundation-freedom
//
// 3. The Balkan Forum — Internship Program (Prishtina, Kosovo)
//    Rolling, unpaid, explicitly open to the whole WB6 region including
//    Albania — but no application deadline or direct apply link was
//    findable on the page itself; would need to email
//    info@thebalkanforum.org directly to get a real link before posting.
