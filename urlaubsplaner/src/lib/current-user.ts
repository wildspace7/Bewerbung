import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

/** Liefert die profiles.id der eingeloggten Person, oder null im Demo-Modus. */
export async function getCurrentProfileId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}
