import {
  addLocalGuestbookEntry,
  addLocalPhoto,
  getLocalGuestbook,
  getLocalPhotos,
} from "./local-store";
import { getStorageMode } from "./supabase";
import {
  addSupabaseGuestbookEntry,
  addSupabasePhoto,
  getSupabaseGuestbook,
  getSupabasePhotos,
} from "./supabase-store";
import type { GuestbookEntry, Photo } from "./types";

export async function getPhotos(): Promise<Photo[]> {
  if (getStorageMode() === "supabase") {
    return getSupabasePhotos();
  }
  return getLocalPhotos();
}

export async function addPhoto(
  file: File,
  caption: string,
  author: string
): Promise<Photo> {
  if (getStorageMode() === "supabase") {
    return addSupabasePhoto(file, caption, author);
  }
  return addLocalPhoto(file, caption, author);
}

export async function getGuestbook(): Promise<GuestbookEntry[]> {
  if (getStorageMode() === "supabase") {
    return getSupabaseGuestbook();
  }
  return getLocalGuestbook();
}

export async function addGuestbookEntry(
  name: string,
  message: string
): Promise<GuestbookEntry> {
  if (getStorageMode() === "supabase") {
    return addSupabaseGuestbookEntry(name, message);
  }
  return addLocalGuestbookEntry(name, message);
}
