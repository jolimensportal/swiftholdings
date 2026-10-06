import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { getPortalData, getViewer } from "@/server/swift-api";

const bytes = (n: number) => {
  if (!n) return "";
  const mb = n / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
};

export async function DocumentsView() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.kind === "admin") redirect("/admin/members");
  const data = await getPortalData();
  if (!data) redirect("/login");

  const { documents } = data;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-primary">Document vault</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your documents
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Agreements, memoranda and statements issued to you.
        </p>
      </header>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No documents have been issued to you yet. They appear here as soon as they are sealed.
          </CardContent>
        </Card>
      ) : (
        <Card className="p-0">
          <CardContent className="py-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.id} · {doc.type} ·{" "}
                    {new Date(doc.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {doc.sizeBytes ? ` · ${bytes(doc.sizeBytes)}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                    doc.status === "signed" || doc.status === "current"
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Downloads are served from private storage through short-lived signed links. Raw storage
        keys are never exposed.
      </p>
    </div>
  );
}