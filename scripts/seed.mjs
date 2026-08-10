// One-time script to load the original sample opportunities (the ones
// that used to live in data.js on the static site) into your new
// Supabase database, already marked as "approved" so they show up
// immediately.
//
// Run once with: npm run seed
//
// Needs SUPABASE_SERVICE_ROLE_KEY in .env.local — find it in
// Supabase Dashboard -> Settings -> API -> service_role (secret).
// NEVER put this key in NEXT_PUBLIC_* or commit it — it bypasses all
// security rules. This script only runs on your own machine.

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OPPORTUNITIES = [
  {
    category: "erasmus",
    title_al: "Shkëmbim Rinor Erasmus+ në Itali",
    title_en: "Erasmus+ Youth Exchange in Italy",
    org: "European Youth Forum",
    location_al: "Firence, Itali",
    location_en: "Florence, Italy",
    deadline: "2026-08-20",
    description_al:
      "Një javë shkëmbimi ndërkulturor mbi qytetarinë aktive, me akomodim dhe udhëtim të mbuluar plotësisht nga programi Erasmus+.",
    description_en:
      "A week-long intercultural exchange on active citizenship, with accommodation and travel fully covered by the Erasmus+ programme.",
    link: "#",
    status: "approved",
  },
  {
    category: "volunteering",
    title_al: "Vullnetar për Edukim Mjedisor",
    title_en: "Environmental Education Volunteer",
    org: "Eco Albania",
    location_al: "Tiranë",
    location_en: "Tirana",
    deadline: null,
    description_al:
      "Ndihmo në organizimin e aktiviteteve edukative për fëmijë mbi mbrojtjen e mjedisit dhe riciklimin, çdo fundjavë.",
    description_en:
      "Help run educational activities for children on environmental protection and recycling, every weekend.",
    link: "#",
    status: "approved",
  },
  {
    category: "ngo",
    title_al: "Praktikë Verore në OJQ për të Drejtat e Njeriut",
    title_en: "Summer Internship at a Human Rights NGO",
    org: "Qendra për Nisma Ligjore Qytetare",
    location_al: "Tiranë",
    location_en: "Tirana",
    deadline: "2026-09-01",
    description_al:
      "Praktikë 6-javore pranë ekipit ligjor, e hapur për studentë të drejtësisë ose shkencave sociale.",
    description_en:
      "A 6-week internship with the legal team, open to law or social science students.",
    link: "#",
    status: "approved",
  },
  {
    category: "erasmus",
    title_al: "Trajnim Rinor mbi Lidership në Portugali",
    title_en: "Youth Leadership Training Course in Portugal",
    org: "SALTO Youth",
    location_al: "Lisbonë, Portugali",
    location_en: "Lisbon, Portugal",
    deadline: "2026-08-30",
    description_al:
      "Kurs trajnimi për të rinj lider komunitarë mbi menaxhimin e projekteve dhe punën me OJQ.",
    description_en:
      "A training course for young community leaders on project management and NGO work.",
    link: "#",
    status: "approved",
  },
  {
    category: "volunteering",
    title_al: "Vullnetar në Strehëz Kafshësh",
    title_en: "Animal Shelter Volunteer",
    org: "Streha e Katërkëmbëshave",
    location_al: "Durrës",
    location_en: "Durrës",
    deadline: null,
    description_al:
      "Kujdes ditor për kafshët e strehëzuara: ushqyerje, shëtitje dhe ndihmë në evente birëse.",
    description_en:
      "Daily care for sheltered animals: feeding, walking, and helping at adoption events.",
    link: "#",
    status: "approved",
  },
  {
    category: "ngo",
    title_al: "Koordinator Vullnetar për Eventin Vjetor",
    title_en: "Volunteer Coordinator for Annual Event",
    org: "TEDx Tirana",
    location_al: "Tiranë",
    location_en: "Tirana",
    deadline: "2026-10-05",
    description_al:
      "Ndihmo në koordinimin logjistik të eventit vjetor, nga regjistrimi i pjesëmarrësve deri te menaxhimi i skenës.",
    description_en:
      "Help coordinate event logistics, from attendee registration to stage management.",
    link: "#",
    status: "approved",
  },
];

const { data, error } = await supabase
  .from("opportunities")
  .insert(OPPORTUNITIES)
  .select();

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${data.length} opportunities.`);
