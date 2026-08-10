"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminEmail } from "@/lib/supabase/admin";

async function assertIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    throw new Error("Not authorized");
  }
}

export async function approveOpportunity(id: string) {
  await assertIsAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("opportunities")
    .update({ status: "approved" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/opportunities");
}

export async function rejectOpportunity(id: string) {
  await assertIsAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("opportunities")
    .update({ status: "rejected" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
