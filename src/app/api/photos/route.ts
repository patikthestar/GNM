import { NextResponse } from "next/server";
import { addPhoto, getPhotos } from "@/lib/store";

export async function GET() {
  try {
    const photos = await getPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("GET /api/photos:", error);
    return NextResponse.json({ error: "사진을 불러올 수 없습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) || "";
    const author = (formData.get("author") as string) || "";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "사진 파일이 필요합니다." }, { status: 400 });
    }

    if (!author.trim()) {
      return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "JPG, PNG, WEBP, GIF 형식만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });
    }

    const photo = await addPhoto(file, caption.trim(), author.trim());
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("POST /api/photos:", error);
    return NextResponse.json({ error: "사진 업로드에 실패했습니다." }, { status: 500 });
  }
}
