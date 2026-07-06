import { NextResponse } from "next/server";
import { getStorageMode } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({ mode: getStorageMode() });
}
