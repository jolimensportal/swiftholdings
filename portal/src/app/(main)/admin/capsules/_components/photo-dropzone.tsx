"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

const MAX_FILES = 24;

export interface PickedPhoto {
  file: File;
  preview: string;
}

/**
 * Photo picker for prefab onboarding. Holds files in memory until the capsule
 * exists — the API attaches photos to an already-created capsule, so the form
 * submits details first and uploads second.
 */
export function PhotoDropzone({
  photos,
  onChange,
}: {
  photos: PickedPhoto[];
  onChange: (next: PickedPhoto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const add = (list: FileList | null) => {
    if (!list) return;
    const accepted = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_FILES - photos.length);

    for (const file of accepted) {
      onChange([
        ...photos,
        { file, preview: URL.createObjectURL(file) },
      ]);
    }
  };

  const removeAt = (index: number) => {
    const target = photos[index];
    if (target) URL.revokeObjectURL(target.preview);
    onChange(photos.filter((_, i) => i !== index));
  };

  const makeHero = (index: number) => {
    if (index === 0) return;
    const next = [...photos];
    const [moved] = next.splice(index, 1);
    if (moved) next.unshift(moved);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-md border border-dashed px-4 py-6 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/10"
            : "border-border bg-background/40",
        )}
      >
        <p className="font-heading text-base text-muted-foreground">Drop photos here</p>
        <p className="mt-1 text-xs text-muted-foreground">
          or choose files · JPEG, PNG, WebP · many at once
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded border border-border px-3 py-1.5 text-xs hover:bg-accent"
        >
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {photos.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Attached · {photos.length} · first is the hero
          </p>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={photo.preview} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.preview}
                  alt=""
                  className="aspect-square w-full rounded border border-border object-cover"
                />
                <span
                  className={cn(
                    "absolute top-1 right-1 flex size-4 items-center justify-center rounded-sm text-[10px]",
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background/90 text-muted-foreground",
                  )}
                  title={index === 0 ? "Hero image" : "Make hero"}
                  onClick={() => makeHero(index)}
                  role={index === 0 ? undefined : "button"}
                >
                  {index === 0 ? "★" : index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute right-1 bottom-1 rounded-sm bg-background/90 px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}