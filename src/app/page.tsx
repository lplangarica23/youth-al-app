import { createClient } from "@/lib/supabase/server";
import { Category } from "@/lib/types";
import AmbientBlobs from "@/components/AmbientBlobs";
import CursorGlow from "@/components/CursorGlow";
import ChatBox from "@/components/ChatBox";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: {
    interests: Category[];
    city: string | null;
    age: number | null;
    experience_level: "none" | "some" | "experienced" | null;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("interests, city, age, experience_level")
      .eq("id", user.id)
      .single();
    profile = data as typeof profile;
  }

  return (
    <main>
      <CursorGlow />

      <section
        id="hero-section"
        className="relative overflow-hidden px-6 pb-16 pt-20 text-center"
      >
        <AmbientBlobs />

        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <p className="entrance entrance-1 mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-inksoft">
            <span className="h-2 w-2 rounded-full bg-acid shadow-[0_0_12px_#d4ff3d]" />
            youth.al
          </p>
          <h1 className="entrance entrance-2 mb-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Çfarë po kërkon?
          </h1>
          <p className="entrance entrance-3 mb-8 text-inksoft">
            Më thuaj me fjalët e tua — jo domosdoshmërisht fjalë kyçe.
          </p>

          <div className="entrance entrance-4">
            <ChatBox userId={user?.id ?? null} profile={profile} />
          </div>
        </div>
      </section>
    </main>
  );
}
