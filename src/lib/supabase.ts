import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { StorageMode } from "./types";

let supabase: SupabaseClient | null = null;

function getSupabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getStorageMode(): StorageMode {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabaseKey();
  return url && key ? "supabase" : "local";
}

export function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabaseKey();

  if (!url || !key) return null;

  supabase = createClient(url, key);
  return supabase;
}
