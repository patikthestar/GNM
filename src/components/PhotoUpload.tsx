"use client";

import { FormEvent, useRef, useState } from "react";

interface PhotoUploadProps {
  onUploaded: () => void;
}

export default function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("사진을 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("author", author);
      formData.append("caption", caption);

      const res = await fetch("/api/photos", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "업로드 실패");
        return;
      }

      setAuthor("");
      setCaption("");
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      onUploaded();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className="group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-nike-light transition-colors hover:border-nike-black"
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="미리보기" className="max-h-[300px] w-full object-contain" />
        ) : (
          <>
            <div className="mb-3 text-4xl">+</div>
            <p className="text-sm font-semibold uppercase tracking-widest text-nike-gray">
              Click to upload
            </p>
            <p className="mt-1 text-xs text-nike-gray">JPG, PNG, WEBP · Max 5MB</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest">
            Your Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름"
            className="nike-input"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="한 줄 설명 (선택)"
            className="nike-input"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="nike-btn nike-btn-primary w-full disabled:opacity-50 md:w-auto"
      >
        {loading ? "UPLOADING..." : "SHARE PHOTO"}
      </button>
    </form>
  );
}
