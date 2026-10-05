import { redirect } from "next/navigation";

import { getPortalData } from "@/server/swift-api";

/**
 * A real session means there is nothing to do here — send them to their
 * dashboard rather than showing a login form they cannot use.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const data = await getPortalData();
  if (data) redirect("/dashboard/default");

  const { error } = await searchParams;

  const message: Record<string, string> = {
    invalid: "That email and password combination was not recognised.",
    missing: "Enter your email and password.",
    unavailable: "Sign-in is temporarily unavailable. Please try again.",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border border-primary/25 bg-card p-8 text-center shadow-xs">
        <p className="font-heading text-lg leading-none">
          SWIFT <span className="text-primary">HORIZON</span>
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-primary/75">Member Portal</p>

        {error && message[error] ? (
          <p
            role="alert"
            className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {message[error]}
          </p>
        ) : null}

        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <form action="/api/login" method="post" className="mt-8 flex flex-col gap-3 text-left">
      <fieldset className="mb-1 flex gap-4 text-xs text-muted-foreground">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="scope"
            value="member"
            defaultChecked
            className="accent-primary"
          />
          Member
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="radio" name="scope" value="admin" className="accent-primary" />
          Swift Holdings staff
        </label>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
      </label>

      <button
        type="submit"
        className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Sign in
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        No account yet?{" "}
        <a
          href="https://swifthorizon.com.gh/briefing"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Request a briefing
        </a>
      </p>
    </form>
  );
}