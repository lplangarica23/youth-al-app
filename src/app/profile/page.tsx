import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="mb-3 text-2xl font-extrabold">Profili</h1>
        <p className="mb-6 text-inksoft">Duhet të hysh në llogari për ta parë këtë faqe.</p>
        <Link href="/login" className="btn-primary">
          Hyr
        </Link>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, city, interests, purpose, age, experience_level")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">Profili</h1>
      <p className="mb-10 text-inksoft">
        Këto detaje ndihmojnë chat-in dhe rezultatet e kërkimit të jenë më të
        personalizuara për ty.
      </p>
      <ProfileForm userId={user.id} email={user.email ?? ""} initial={profile} />
    </main>
  );
}
