import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./config";

// Client-Komponenten: liest/schreibt die Session aus den Browser-Cookies.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
