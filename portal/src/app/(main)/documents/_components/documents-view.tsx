import { Card, CardContent } from "@/components/ui/card";
import { documentLibrary, yourDocuments } from "@/data/member-portal";

export function DocumentsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">
        Documents · Sealed under Ghanaian law · downloadable PDFs
      </p>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Your files</p>
          <div className="divide-y divide-border">
            {yourDocuments.map((d) => (
              <div key={d.name} className="grid grid-cols-[2fr_1fr_1fr_auto] py-3 text-sm">
                <span className="font-medium text-foreground">{d.name}</span>
                <span className="text-muted-foreground">{d.date}</span>
                <span className="text-muted-foreground">{d.status}</span>
                <span className="text-right text-primary">open</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Project library — for members</p>
          <div className="divide-y divide-border">
            {documentLibrary.map((d) => (
              <div key={d.name} className="grid grid-cols-[2fr_1fr_auto] py-3 text-sm">
                <span className="text-foreground/80">{d.name}</span>
                <span className="text-muted-foreground">{d.meta}</span>
                <span className="text-right text-primary">open</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
