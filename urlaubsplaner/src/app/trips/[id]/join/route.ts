import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Ziel des Einladungslinks. src/proxy.ts sorgt schon dafür, dass hier nur
// eingeloggte Nutzer:innen ankommen (sonst Redirect zu /login?redirect=...).
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { origin } = request.nextUrl;

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}/trips/${id}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${origin}/login?redirect=${encodeURIComponent(`/trips/${id}/join`)}`,
    );
  }

  const { data: existing } = await supabase
    .from("trip_participants")
    .select("id")
    .eq("trip_id", id)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from("trip_participants").insert({
      trip_id: id,
      profile_id: user.id,
      role: "member",
    });

    // trips_select_member greift erst, sobald die Mitgliedschaft existiert —
    // schlägt der Insert fehl (z. B. Trip existiert nicht), landet man auf
    // der Trip-Liste statt auf einer Seite ohne Zugriffsrechte.
    if (error) {
      return NextResponse.redirect(`${origin}/trips`);
    }
  }

  return NextResponse.redirect(`${origin}/trips/${id}`);
}
