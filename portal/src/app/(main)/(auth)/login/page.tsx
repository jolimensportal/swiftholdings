import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border border-primary/25 bg-card p-8 text-center shadow-xs">
        <p className="font-heading text-lg leading-none">
          THE SWIFT <span className="text-primary">PROJECT</span>
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-primary/75">Private Briefing Portal</p>

        <div className="mt-8 flex flex-col gap-3 text-left">
          <Input type="email" placeholder="Email" className="bg-background" />
          <Input type="password" placeholder="Password" className="bg-background" />
          <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Secure Login
          </Button>
        </div>

        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>Forgot password</span>
          <span>Request access</span>
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-primary/60">🔒 Encrypted</p>
      </div>
    </div>
  );
}
