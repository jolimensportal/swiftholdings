import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { documents } from "@/data/portal";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-muted-foreground text-sm">
          Agreements, statements, and title documents for your funded units.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Document library</CardTitle>
          <CardDescription>Signed and issued records</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-foreground/10">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileText className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {doc.id} · {doc.size} · {doc.date}
                </p>
              </div>
              <Badge
                variant={doc.status === "Signed" ? "default" : "secondary"}
                className={
                  doc.status === "Signed"
                    ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                    : ""
                }
              >
                {doc.status}
              </Badge>
              <Button variant="ghost" size="icon-sm" aria-label={`Download ${doc.name}`}>
                <Download className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}