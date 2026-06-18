"use client";

import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import type { CarDto } from "@elite-drive/types";
import { Button } from "@/components/ui/button";
import { carsApi } from "../api";
import { ApiError } from "@/lib/api-client";

export function CarImagesManager({ car }: { car: CarDto }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["cars", car.id] });
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      await carsApi.uploadImages(car.id, Array.from(files));
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Зураг оруулахад алдаа");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeImage(imageId: string) {
    try {
      await carsApi.deleteImage(car.id, imageId);
      await refresh();
    } catch {
      setError("Зураг устгахад алдаа гарлаа");
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {car.images.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.id)}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Устгах"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="size-5" />
              <span className="text-xs">Зураг нэмэх</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {car.images.length === 0 && !error && (
        <p className="mt-2 text-xs text-muted-foreground">
          Зураггүй бол түр зуурын өнгөт placeholder харагдана.
        </p>
      )}
    </div>
  );
}
