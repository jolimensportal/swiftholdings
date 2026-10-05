"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { PhotoDropzone, type PickedPhoto } from "./photo-dropzone";

const API_ORIGIN = "https://swifthorizon.com.gh";

const STATUSES = [
  { value: "building", label: "Building" },
  { value: "in-revenue", label: "In revenue" },
  { value: "completed", label: "Completed" },
] as const;

type Status = (typeof STATUSES)[number]["value"];

export function CapsuleOnboardingForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [hub, setHub] = useState("");
  const [phase, setPhase] = useState("1");
  const [status, setStatus] = useState<Status>("building");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("38");
  const [share, setShare] = useState("70/30");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [provenance, setProvenance] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string; name: string } | null>(null);

  const submit = async () => {
    if (busy || created) return;
    setError(null);

    if (!name.trim() || !hub.trim()) {
      setError("Name and hub are required.");
      return;
    }

    setBusy(true);

    try {
      // The API attaches photos to an existing capsule, so details go first.
      const createRes = await fetch(`${API_ORIGIN}/api/admin/capsules`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          hub: hub.trim(),
          phase: Number(phase) || 1,
          status,
          // The form takes dollars; the column stores cents.
          priceUsd: Math.round((Number(price) || 0) * 100),
          areaSqm: Number(area) || 38,
          shareRatio: share.trim(),
        }),
      });

      const createBody = (await createRes.json()) as {
        capsule?: { id: string; name: string };
        error?: string;
      };

      if (!createRes.ok || !createBody.capsule) {
        throw new Error(createBody.error ?? "Could not create the prefab");
      }

      if (photos.length > 0) {
        const form = new FormData();
        form.set("capsuleId", createBody.capsule.id);
        if (provenance.trim()) form.set("caption", provenance.trim());
        for (const photo of photos) form.append("images", photo.file);

        const uploadRes = await fetch(`${API_ORIGIN}/api/admin/capsules`, {
          method: "POST",
          credentials: "include",
          body: form,
        });

        if (!uploadRes.ok) {
          const body = (await uploadRes.json().catch(() => ({}))) as { error?: string };
          throw new Error(
            `Prefab created, but photos failed: ${body.error ?? uploadRes.status}`
          );
        }
      }

      setCreated(createBody.capsule);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    return (
      <div className="rounded-md border border-primary/30 bg-primary/5 p-6">
        <p className="font-heading text-lg text-foreground">Prefab onboarded</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {created.name} · {created.id}
          {photos.length > 0 ? ` · ${photos.length} photos attached` : ""}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/capsules")}
            className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Back to capsules
          </button>
          <button
            type="button"
            onClick={() => {
              setCreated(null);
              setName("");
              setHub("");
              setPhotos([]);
              setProvenance("");
              setError(null);
            }}
            className="rounded border border-border px-3 py-1.5 text-xs"
          >
            Onboard another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[0.2em] text-primary uppercase">Unit details</p>

        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Oyarifa P7 Capsule"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Hub">
            <input
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              placeholder="Oyarifa"
              className={inputClass}
            />
          </Field>
          <Field label="Phase">
            <input
              type="number"
              min={1}
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Status">
          <div className="flex gap-2">
            {STATUSES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={cn(
                  "rounded border px-3 py-1.5 text-xs",
                  status === option.value
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (USD)">
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="52400"
              className={inputClass}
            />
          </Field>
          <Field label="Area (m²)">
            <input
              type="number"
              min={0}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Share split">
          <input
            value={share}
            onChange={(e) => setShare(e.target.value)}
            placeholder="70/30"
            className={inputClass}
          />
        </Field>

        <div className="rounded border border-border bg-background/40 p-3 text-xs text-muted-foreground">
          Creates the capsule record, then uploads the photos below. The first photo
          becomes the hero used wherever this capsule appears as a card.
        </div>

        {error ? (
          <p role="alert" className="rounded border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create prefab"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[10px] tracking-[0.2em] text-primary uppercase">Photographs</p>

        <PhotoDropzone photos={photos} onChange={setPhotos} />

        <Field label="Provenance">
          <input
            value={provenance}
            onChange={(e) => setProvenance(e.target.value)}
            placeholder="Supplier reference"
            className={inputClass}
          />
        </Field>

        <p className="text-xs text-muted-foreground">
          Storage keys never reach the browser. Photos are served by public ID.
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}