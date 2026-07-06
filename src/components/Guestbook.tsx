"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { GuestbookEntry } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      if (res.ok) setEntries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "작성 실패");
        return;
      }

      setName("");
      setMessage("");
      fetchEntries();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="guestbook" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nike-orange">
              Messages
            </p>
            <h2 className="text-display text-6xl md:text-7xl">GUESTBOOK</h2>
          </div>
          <p className="max-w-xs text-sm text-nike-gray">
            친구에게 전하고 싶은 말을 남겨보세요.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <div className="sticky top-24 space-y-6 border-l-4 border-nike-volt pl-6">
              <h3 className="text-display text-3xl">LEAVE A NOTE</h3>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  className="nike-input"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  rows={5}
                  maxLength={500}
                  className="nike-input resize-none"
                  required
                />
                <p className="mt-1 text-right text-xs text-nike-gray">
                  {message.length}/500
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="nike-btn nike-btn-primary w-full disabled:opacity-50"
              >
                {submitting ? "SENDING..." : "POST MESSAGE"}
              </button>
            </div>
          </form>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse bg-neutral-100" />
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center border border-dashed border-neutral-300">
                <div className="text-center">
                  <p className="text-display text-4xl text-neutral-300">EMPTY</p>
                  <p className="mt-2 text-sm text-nike-gray">첫 방명록을 남겨보세요!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <article
                    key={entry.id}
                    className="nike-card group border border-neutral-100 p-6 shadow-sm transition-shadow hover:shadow-md"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="mb-3 flex items-baseline justify-between gap-4">
                      <h4 className="text-display text-2xl">{entry.name}</h4>
                      <time className="shrink-0 text-xs text-nike-gray">
                        {formatDate(entry.created_at)}
                      </time>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                      {entry.message}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
