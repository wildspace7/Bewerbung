import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

// Server-Komponenten und Route Handler: Session kommt aus den Request-Cookies.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // In Server-Komponenten ist Schreiben nicht erlaubt — die Middleware
          // erneuert die Session, deshalb ist das hier gefahrlos ignorierbar.
        }
      },
    },
  });
}
