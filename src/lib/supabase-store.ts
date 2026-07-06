import { v4 as uuidv4 } from "uuid";
import { getSupabase } from "./supabase";
import type { GuestbookEntry, Photo } from "./types";

const BUCKET = "photos";

export async function getSupabasePhotos(): Promise<Photo[]> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Photo[];
}

export async function addSupabasePhoto(
  file: File,
  caption: string,
  author: string
): Promise<Photo> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  const photo: Omit<Photo, "id"> & { id?: string } = {
    url: publicUrl,
    caption,
    author,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("photos")
    .insert(photo)
    .select()
    .single();

  if (error) throw error;
  return data as Photo;
}

export async function getSupabaseGuestbook(): Promise<GuestbookEntry[]> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as GuestbookEntry[];
}

export async function addSupabaseGuestbookEntry(
  name: string,
  message: string
): Promise<GuestbookEntry> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name, message })
    .select()
    .single();

  if (error) throw error;
  return data as GuestbookEntry;
}
