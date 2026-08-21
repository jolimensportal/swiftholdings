import { Card, CardContent } from "@/components/ui/card";
import { settings } from "@/data/admin";

export function AdminSettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">System settings</p>
      <Card>
        <CardContent className="pt-6">
          <div className="divide-y divide-border">
            {settings.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[1.2fr_1fr_1.6fr] items-center gap-2 py-3 text-sm"
              >
                <p className="font-medium text-foreground">{s.label}</p>
                <span className="text-primary/90">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.note}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
