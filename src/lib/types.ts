export interface Photo {
  id: string;
  url: string;
  caption: string;
  author: string;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export type StorageMode = "local" | "supabase";
