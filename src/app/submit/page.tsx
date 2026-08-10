import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubmitForm from "@/components/SubmitForm";

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">
        Shto një mundësi
      </h1>
      <p className="mb-10 text-inksoft">
        Përfaqëson një OJQ ose organizatë? Plotëso formularin — mundësia jote
        do të shqyrtohet para se të bëhet publike.
      </p>

      {user ? (
        <SubmitForm userId={user.id} />
      ) : (
        <div className="rounded-2xl border-2 border-white/20 bg-panel p-8 text-center">
          <p className="mb-4 text-inksoft">
            Duhet të krijosh një llogari (falas) për të dërguar një mundësi.
          </p>
          <Link href="/signup" className="btn-primary">
            Regjistrohu
          </Link>
        </div>
      )}
    </main>
  );
}
