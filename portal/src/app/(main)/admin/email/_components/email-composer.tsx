"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
// A client component must not import "@/server/swift-api": that module pulls in
// next/headers, which is Server-Components-only, and the build fails outright if
// a client bundle reaches it. Same fetch contract, spelled out again here.
const API_ORIGIN = "https://swifthorizon.com.gh";

interface EmailContact {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  handled: boolean;
}

interface EmailDirectoryRow {
  id: string;
  name: string;
  email: string;
  segment: string;
  tier: string;
  createdAt: number;
}

interface MutateResult {
  ok: boolean;
  error?: string;
}

async function sendEmailFromConsole(message: {
  to: string[];
  subject: string;
  body: string;
}): Promise<MutateResult> {
  try {
    const response = await fetch(`${API_ORIGIN}/api/admin/email`, {
      method: "POST",
      // The session cookie is scoped to .swifthorizon.com.gh and this is a
      // cross-origin request from portal.swifthorizon.com.gh, so it must be sent
      // explicitly. Without it the Worker sees no admin and answers 401.
      credentials: "include",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ action: "send", ...message }),
    });

    const body = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      return { ok: false, error: body.error ?? "The message was not sent." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the mail service." };
  }
}

interface EmailComposerProps {
  enquiries: EmailContact[];
  directory: EmailDirectoryRow[];
}

interface Recipient {
  email: string;
  name: string;
}

/**
 * The operator mail composer.
 *
 * Recipients come from two places because both are real jobs: `enquiries` are
 * people who already asked to hear from us, and `directory` are portal members
 * who have a relationship but may not have asked. Either can be picked, and any
 * address can be typed, so the console is never the thing standing between the
 * operator and a legitimate send.
 *
 * Nothing is sent to the marketing Worker until every field is present, so a
 * half-finished message cannot leave the building.
 */
export function EmailComposer({ enquiries, directory }: EmailComposerProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [manual, setManual] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const chosen = useMemo(() => new Set(recipients.map((r) => r.email)), [recipients]);

  const suggestions = useMemo<Recipient[]>(
    () => [
      ...enquiries.map((e) => ({ email: e.email, name: e.name })),
      ...directory
        .filter((m) => !enquiries.some((e) => e.email === m.email))
        .map((m) => ({ email: m.email, name: m.name })),
    ],
    [enquiries, directory],
  );

  const addManual = () => {
    const value = manual.trim().toLowerCase();
    if (value === "" || chosen.has(value)) return;
    setRecipients((prev) => [...prev, { email: value, name: value }]);
    setManual("");
  };

  const remove = (email: string) => {
    setRecipients((prev) => prev.filter((r) => r.email !== email));
  };

  const send = async () => {
    if (busy) return;
    setError(null);
    setSent(null);

    const to = recipients.map((r) => r.email);

    if (to.length === 0) {
      setError("Add at least one recipient.");
      return;
    }
    if (subject.trim() === "") {
      setError("The message needs a subject.");
      return;
    }
    if (body.trim() === "") {
      setError("The message body is empty.");
      return;
    }

    setBusy(true);

    try {
      const result = await sendEmailFromConsole({ to, subject: subject.trim(), body: body.trim() });

      if (!result.ok) {
        setError(result.error ?? "The message was not sent.");
        return;
      }

      setSent(`Sent to ${to.length} recipient${to.length === 1 ? "" : "s"}.`);
      setRecipients([]);
      setManual("");
      setSubject("");
      setBody("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose</CardTitle>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="recipient-search">Recipients</FieldLabel>

            {recipients.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {recipients.map((r) => (
                  <Badge key={r.email} variant="secondary" className="gap-1">
                    {r.name === r.email ? r.email : `${r.name} · ${r.email}`}
                    <button
                      type="button"
                      onClick={() => remove(r.email)}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${r.email}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-start font-normal">
                  {recipients.length === 0 ? "Add from enquiries or members…" : "Add another recipient…"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search name or address…" />
                  <CommandList>
                    <CommandEmpty>Nobody matches that.</CommandEmpty>
                    <CommandGroup heading="Enquiries and members">
                      {suggestions
                        .filter((s) => !chosen.has(s.email))
                        .map((s) => (
                          <CommandItem
                            key={s.email}
                            value={`${s.name} ${s.email}`}
                            onSelect={() => {
                              setRecipients((prev) => [...prev, s]);
                              setPickerOpen(false);
                            }}
                          >
                            <span className="flex flex-col">
                              <span>{s.name}</span>
                              <span className="text-xs text-muted-foreground">{s.email}</span>
                            </span>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="mt-2 flex gap-2">
              <Input
                id="recipient-search"
                type="email"
                placeholder="or type any address"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addManual();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addManual}>
                Add
              </Button>
            </div>

            <FieldDescription>Pick someone who enquired, or paste any address you hold lawfully.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <Input
              id="subject"
              value={subject}
              maxLength={200}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your private briefing is confirmed"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="body">Message</FieldLabel>
            <Textarea
              id="body"
              value={body}
              rows={14}
              maxLength={20000}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Plain text. Blank lines become paragraph breaks."
              className="font-mono text-sm"
            />
            <FieldDescription>
              Plain text only. Blank lines become paragraphs, single newlines become line breaks.
            </FieldDescription>
          </Field>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {sent && <p className="text-sm text-emerald-600 dark:text-emerald-400">{sent}</p>}

          <div className="flex items-center gap-2">
            <Button onClick={send} disabled={busy}>
              {busy ? "Sending…" : "Send"}
            </Button>
            <span className={cn("text-xs text-muted-foreground")}>
              From Swift Horizon &lt;info@swifthorizon.com.gh&gt;
            </span>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
