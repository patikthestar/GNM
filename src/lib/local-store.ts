import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { GuestbookEntry, Photo } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const PHOTOS_FILE = path.join(DATA_DIR, "photos.json");
const GUESTBOOK_FILE = path.join(DATA_DIR, "guestbook.json");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getLocalPhotos(): Promise<Photo[]> {
  await ensureDirs();
  const photos = await readJson<Photo[]>(PHOTOS_FILE, []);
  return photos.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function addLocalPhoto(
  file: File,
  caption: string,
  author: string
): Promise<Photo> {
  await ensureDirs();

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const id = uuidv4();
  const filename = `${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);

  const photo: Photo = {
    id,
    url: `/uploads/${filename}`,
    caption,
    author,
    created_at: new Date().toISOString(),
  };

  const photos = await readJson<Photo[]>(PHOTOS_FILE, []);
  photos.unshift(photo);
  await writeJson(PHOTOS_FILE, photos);

  return photo;
}

export async function getLocalGuestbook(): Promise<GuestbookEntry[]> {
  await ensureDirs();
  const entries = await readJson<GuestbookEntry[]>(GUESTBOOK_FILE, []);
  return entries.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function addLocalGuestbookEntry(
  name: string,
  message: string
): Promise<GuestbookEntry> {
  await ensureDirs();

  const entry: GuestbookEntry = {
    id: uuidv4(),
    name,
    message,
    created_at: new Date().toISOString(),
  };

  const entries = await readJson<GuestbookEntry[]>(GUESTBOOK_FILE, []);
  entries.unshift(entry);
  await writeJson(GUESTBOOK_FILE, entries);

  return entry;
}
