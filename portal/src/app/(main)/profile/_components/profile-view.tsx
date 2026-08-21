import { Card, CardContent } from "@/components/ui/card";
import { profile } from "@/data/member-portal";

export function ProfileView() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-[0.22em] text-primary/75">{profile.kyc}</p>

      <div className="flex items-center gap-6">
        <div className="flex size-14 items-center justify-center rounded-full border border-primary/50 font-heading text-2xl text-primary">
          {profile.initials}
        </div>
        <div>
          <p className="font-heading text-3xl text-foreground">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{profile.route}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Payouts</p>
            <Row label="Settlement" value={profile.settlement} />
            <Row label="Bank on file" value={profile.bank} />
            <Row label="Statement language" value={profile.language} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary/75">Security & contact</p>
            <Row label="Two-factor authentication" value={profile.twoFactor} />
            <Row label="Session encryption" value={profile.encryption} />
            <Row label="Phone" value={profile.phone} />
            <Row label="Email" value={profile.email} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between py-4 text-sm">
          <span className="text-muted-foreground">
            Your details stay with Swift Holdings — never sold, never shared.
          </span>
          <span className="text-primary">manage</span>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
