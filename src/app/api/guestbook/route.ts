import { NextResponse } from "next/server";
import { addGuestbookEntry, getGuestbook } from "@/lib/store";

export async function GET() {
  try {
    const entries = await getGuestbook();
    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/guestbook:", error);
    return NextResponse.json({ error: "방명록을 불러올 수 없습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name as string)?.trim();
    const message = (body.message as string)?.trim();

    if (!name) {
      return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: "메시지를 입력해주세요." }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "메시지는 500자 이하여야 합니다." }, { status: 400 });
    }

    const entry = await addGuestbookEntry(name, message);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/guestbook:", error);
    return NextResponse.json({ error: "방명록 작성에 실패했습니다." }, { status: 500 });
  }
}
