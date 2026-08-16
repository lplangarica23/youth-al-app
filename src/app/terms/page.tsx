export const metadata = { title: "Kushtet e Përdorimit — youth.al" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold text-ink">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-inksoft">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 rounded-2xl border-2 border-orange/40 bg-orange/10 p-5">
        <p className="text-sm font-bold text-orange">
          ⚠️ Draft — në pritje të shqyrtimit ligjor
        </p>
        <p className="mt-2 text-sm text-inksoft">
          Ky dokument është një pikënisje e shkruar për t&apos;u shqyrtuar nga një
          jurist i kualifikuar përpara se të konsiderohet kushte përfundimtare.
        </p>
      </div>

      <h1 className="mb-10 text-3xl font-extrabold">Kushtet e Përdorimit</h1>

      <Section title="1. Pranimi i kushteve">
        <p>
          Duke krijuar një llogari ose duke përdorur youth.al, pranon këto Kushte
          Përdorimi.
        </p>
      </Section>

      <Section title="2. Kushtet e pjesëmarrjes">
        <p>
          Duhet të jesh <strong className="text-ink">të paktën 18 vjeç</strong> për
          të krijuar një llogari — kjo konfirmohet gjatë regjistrimit.
        </p>
      </Section>

      <Section title="3. Llogaria jote">
        <p>
          Je përgjegjës për sigurinë e kredencialeve të tua dhe saktësinë e
          informacionit në profilin tënd. Nuk lejohet krijimi i llogarive me
          informacion të rremë.
        </p>
      </Section>

      <Section title="4. Përdorimi i pranueshëm">
        <p>
          Mos dërgo mundësi të rreme ose mashtruese, mos përdor platformën për të
          ngacmuar përdorues të tjerë, mos u përpiq të anashkalosh masat e
          sigurisë, dhe mos përdor veçoritë e AI për të gjeneruar përmbajtje të
          dëmshme apo të paligjshme.
        </p>
      </Section>

      <Section title="5. Përmbajtja e dërguar nga përdoruesit">
        <p>
          Je përgjegjës për saktësinë e çdo mundësie që dërgon. Të gjitha
          dërgesat shqyrtohen përpara se të bëhen publike — por shqyrtimi{" "}
          <strong className="text-ink">nuk garanton saktësi absolute</strong>.
          Statusi &quot;i verifikuar&quot; pasqyron procesin tonë të shqyrtimit,
          jo një garanci absolute.
        </p>
      </Section>

      <Section title="6. Veçoritë e AI — sqarime të rëndësishme">
        <p>
          Chat-i me AI dhe mjeti i dërgimit me AI ofrohen për të të ndihmuar të
          zbulosh dhe përshkruash mundësi — nuk zëvendësojnë verifikimin direkt
          me organizatën. AI-ja mund të gabojë; trajtoje si pikënisje, jo si
          burim përfundimtar i së vërtetës.
        </p>
      </Section>

      <Section title="7. Asnjë garanci rezultatesh">
        <p>
          Youth.al të ndihmon të zbulosh mundësi — nuk garantojmë pranim,
          financim, apo sukses në asnjë mundësi të listuar. Vendimet e pranimit
          merren tërësisht nga organizatat përkatëse.
        </p>
      </Section>

      <Section title="8. Pronësia intelektuale">
        <p>
          Marka, dizajni dhe kodi i platformës youth.al i përkasin [EMRI I
          THEMELUESIT/KOMPANISË]. Përmbajtja e dërguar nga përdoruesit mbetet e
          lidhur me organizatën dërguese.
        </p>
      </Section>

      <Section title="9. Përfundimi">
        <p>
          Mund ta fshish llogarinë tënde në çdo kohë. Ne mund të pezullojmë ose
          përfundojmë llogari që shkelin këto kushte.
        </p>
      </Section>

      <Section title="10. Kontakt">
        <p>Pyetje rreth këtyre kushteve: [SHTO EMAIL TË VËRTETË]</p>
      </Section>
    </main>
  );
}
