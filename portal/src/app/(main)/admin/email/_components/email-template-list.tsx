"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// See email-composer.tsx: "@/server/swift-api" imports next/headers and cannot
// be reached from a client bundle, so the template calls are re-declared here.
const API_ORIGIN = "https://swifthorizon.com.gh";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

interface MutateResult {
  ok: boolean;
  error?: string;
}

async function postToMailApi(payload: Record<string, unknown>): Promise<MutateResult> {
  try {
    const response = await fetch(`${API_ORIGIN}/api/admin/email`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const body = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      return { ok: false, error: body.error ?? "The request was rejected." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the mail service." };
  }
}

const saveEmailTemplate = (template: {
  id?: string;
  name: string;
  subject: string;
  body: string;
}) => postToMailApi({ action: "save-template", ...template });

const deleteEmailTemplate = (id: string) => postToMailApi({ action: "delete-template", id });

interface EmailTemplateListProps {
  templates: EmailTemplate[];
}

/**
 * Saved message bodies.
 *
 * Deliberately plain text. A stored HTML template is a stored injection surface:
 * whoever renders it later has to escape whatever was typed here, and the only
 * thing an operator needs from a saved template is the words.
 */
export function EmailTemplateList({ templates }: EmailTemplateListProps) {
  const router = useRouter();

  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = templates.length === 0 && !creating;

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSubject("");
    setBody("");
    setError(null);
    setCreating(true);
  };

  const openEdit = (template: EmailTemplate) => {
    setEditing(template);
    setName(template.name);
    setSubject(template.subject);
    setBody(template.body);
    setError(null);
    setCreating(true);
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
    setError(null);
  };

  const save = async () => {
    if (busy) return;
    setError(null);

    if (name.trim() === "") {
      setError("Give the template a name.");
      return;
    }
    if (subject.trim() === "") {
      setError("A template needs a subject.");
      return;
    }
    if (body.trim() === "") {
      setError("The template body is empty.");
      return;
    }

    setBusy(true);

    try {
      const result = await saveEmailTemplate({
        id: editing?.id,
        name: name.trim(),
        subject: subject.trim(),
        body: body.trim(),
      });

      if (!result.ok) {
        setError(result.error ?? "The template was not saved.");
        return;
      }

      close();
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (template: EmailTemplate) => {
    if (busy) return;
    setBusy(true);

    try {
      const result = await deleteEmailTemplate(template.id);

      if (!result.ok) {
        setError(result.error ?? "The template was not removed.");
        return;
      }

      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Saved templates</CardTitle>
        <Button variant="outline" size="sm" onClick={openCreate} disabled={open}>
          New template
        </Button>
      </CardHeader>

      <CardContent>
        {templates.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No templates yet</EmptyTitle>
              <EmptyDescription>Save a message you send often and reuse it instead of rewriting it.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="divide-y divide-border">
            {templates.map((template) => (
              <div key={template.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{template.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{template.subject}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(template)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(template)}
                    disabled={busy}
                    className="text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={creating} onOpenChange={(open) => (open ? setCreating(true) : close())}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit template" : "New template"}</DialogTitle>
              <DialogDescription>
                Plain text. Open a template from the composer by copying it into the message.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="template-name">Name</FieldLabel>
                <Input
                  id="template-name"
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Briefing confirmed"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="template-subject">Subject</FieldLabel>
                <Input
                  id="template-subject"
                  value={subject}
                  maxLength={200}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Your private briefing is confirmed"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="template-body">Message</FieldLabel>
                <Textarea
                  id="template-body"
                  value={body}
                  rows={10}
                  maxLength={20000}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-mono text-sm"
                />
              </Field>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </FieldGroup>

            <DialogFooter>
              <Button variant="outline" onClick={close} disabled={busy}>
                Cancel
              </Button>
              <Button onClick={save} disabled={busy}>
                {busy ? "Saving…" : "Save template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
