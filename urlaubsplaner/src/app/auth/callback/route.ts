import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Ziel des Magic-Links: tauscht den Code gegen eine Session und legt beim
// ersten Login das Profil an (profiles.name ist not null — als Startwert dient
// der lokale Teil der E-Mail, änderbar in den Einstellungen).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/trips";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        name: user.email?.split("@")[0] ?? "Reisende:r",
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
