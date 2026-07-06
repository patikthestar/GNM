"use client";

import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/types";
import PhotoUpload from "./PhotoUpload";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Photo | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      if (res.ok) setPhotos(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <section id="photos" className="bg-nike-light py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nike-orange">
              Gallery
            </p>
            <h2 className="text-display text-6xl md:text-7xl">PHOTOS</h2>
          </div>
          <p className="max-w-xs text-sm text-nike-gray">
            함께 찍은 사진을 올리고 추억을 모아보세요.
          </p>
        </div>

        <div className="mb-16 grid gap-12 lg:grid-cols-2">
          <div className="nike-card p-8 shadow-lg">
            <h3 className="text-display mb-6 text-3xl">UPLOAD</h3>
            <PhotoUpload onUploaded={fetchPhotos} />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-display text-[8rem] leading-none text-neutral-200">
              {photos.length.toString().padStart(2, "0")}
            </span>
            <p className="text-sm font-semibold uppercase tracking-widest">
              Shared Moments
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-neutral-200" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-display text-4xl text-neutral-300">NO PHOTOS YET</p>
            <p className="mt-2 text-sm text-nike-gray">첫 번째 사진을 올려보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelected(photo)}
                className={`nike-card group relative aspect-square overflow-hidden bg-neutral-200 ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || "사진"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 p-4 text-left text-white">
                    <p className="text-xs font-semibold uppercase tracking-widest">
                      {photo.author}
                    </p>
                    {photo.caption && (
                      <p className="mt-1 text-sm">{photo.caption}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute -top-12 right-0 text-sm font-semibold uppercase tracking-widest text-white hover:text-nike-volt"
            >
              Close ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.url}
              alt={selected.caption || "사진"}
              className="max-h-[80vh] w-full object-contain"
            />
            <div className="mt-4 text-white">
              <p className="text-display text-2xl">{selected.author}</p>
              {selected.caption && (
                <p className="mt-1 text-neutral-300">{selected.caption}</p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                {formatDate(selected.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
