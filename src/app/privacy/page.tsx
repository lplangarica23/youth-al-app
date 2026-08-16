export const metadata = { title: "Politika e Privatësisë — youth.al" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold text-ink">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-inksoft">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 rounded-2xl border-2 border-orange/40 bg-orange/10 p-5">
        <p className="text-sm font-bold text-orange">
          ⚠️ Draft — në pritje të shqyrtimit ligjor
        </p>
        <p className="mt-2 text-sm text-inksoft">
          Ky dokument është një pikënisje e shkruar për t&apos;u shqyrtuar nga një
          jurist i kualifikuar përpara se të konsiderohet një politikë përfundimtare.
        </p>
      </div>

      <h1 className="mb-10 text-3xl font-extrabold">Politika e Privatësisë</h1>

      <Section title="1. Kush jemi">
        <p>
          youth.al lidh të rinjtë në Shqipëri me mundësi vullnetarizmi, Erasmus+,
          dhe aktivitete nga OJQ.
        </p>
        <p>Kontakt për çështje privatësie: [SHTO NJË EMAIL TË VËRTETË]</p>
      </Section>

      <Section title="2. Çfarë informacioni mbledhim">
        <p>
          <strong className="text-ink">Llogaria:</strong> email, fjalëkalimi (i
          ruajtur në mënyrë të sigurt nga Supabase).
        </p>
        <p>
          <strong className="text-ink">Profili:</strong> emri (opsional), mosha,
          qyteti, interesat, qëllimi, niveli i përvojës.
        </p>
        <p>
          <strong className="text-ink">Përmbajtja:</strong> mundësitë që dërgon,
          mesazhet te chat-i i AI.
        </p>
        <p>
          <strong className="text-ink">Sjellja:</strong> kërkimet, mundësitë e
          ruajtura/swipe-uara, statusi i aplikimeve.
        </p>
      </Section>

      <Section title="3. Si e përdorim informacionin">
        <p>
          Për të krijuar llogarinë tënde, për të personalizuar rezultatet e
          kërkimit dhe rekomandimet, për të të ndihmuar të gjurmosh mundësitë, dhe
          për të mbajtur platformën të sigurt. Nuk e shesim informacionin tënd te
          palë të treta.
        </p>
      </Section>

      <Section title="4. AI dhe përpunimi nga palë të treta">
        <p>
          Përdorim Google Gemini API për chat-in me AI dhe mjetin e dërgimit të
          mundësive. Teksti që dërgon i kalon serverave të Google për përpunim.
        </p>
        <p>
          <strong className="text-orange">
            Aktualisht përdorim planin falas të Gemini.
          </strong>{" "}
          Sipas kushteve të Google për planin falas, kërkesat e dërguara mund të
          përdoren për të përmirësuar modelet e tyre AI.
        </p>
        <p>
          AI-ja është një mjet zbulimi, jo vendimmarrës — është dizajnuar të mos
          shpikë mundësi, organizata, afate apo financim që nuk ekzistojnë
          realisht. Megjithatë, si çdo sistem AI, mund të gabojë. Gjithmonë
          verifiko detajet direkt me organizatën përpara se të vendosësh.
        </p>
      </Section>

      <Section title="5. Me kë ndajmë informacionin">
        <p>Google (Gemini API), Supabase (baza e të dhënave), Vercel (hosting).</p>
        <p>Nuk ndajmë informacionin tënd me reklamues apo shitës të dhënash.</p>
      </Section>

      <Section title="6. Të drejtat e tua">
        <p>
          Ke të drejtë të aksesosh, korrigjosh (direkt në faqen Profili për shumicën
          e fushave), fshish informacionin tënd, ose të tërheqësh pëlqimin duke
          fshirë llogarinë. Na kontakto në [SHTO EMAIL] për këto kërkesa.
        </p>
      </Section>

      <Section title="7. Politika e moshës">
        <p>
          youth.al është aktualisht i disponueshëm vetëm për përdorues{" "}
          <strong className="text-ink">18 vjeç e sipër</strong>. Kjo konfirmohet
          gjatë regjistrimit.
        </p>
      </Section>

      <Section title="8. Kontakt">
        <p>Pyetje rreth kësaj politike: [SHTO EMAIL TË VËRTETË]</p>
      </Section>
    </main>
  );
}
