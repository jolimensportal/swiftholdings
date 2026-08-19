import { useState } from 'react';

interface Props {
  next: string;
}

interface LoginResult {
  ok: boolean;
  error?: string;
}

export default function LoginForm({ next }: Props): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as LoginResult;

      if (!response.ok || !result.ok) {
        setError(result.error ?? 'Sign in failed. Please try again.');
        setSubmitting(false);
        return;
      }

      window.location.assign(next === '' ? '/members' : next);
    } catch {
      setError('The network is unreachable. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <label className="grid gap-2 text-sm">
        <span className="text-[var(--marketing-dim-on-dark)]">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          aria-invalid={error !== null}
          placeholder="you@example.com"
          className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-950)] px-4 py-3 text-[var(--marketing-ink-on-dark)] placeholder:text-[var(--marketing-dim-on-dark)] focus:border-[var(--marketing-gold-500)] focus:outline-none"
        />
      </label>

      <label className="grid gap-2 text-sm">
        <span className="text-[var(--marketing-dim-on-dark)]">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          aria-invalid={error !== null}
          placeholder="Your member password"
          className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-950)] px-4 py-3 text-[var(--marketing-ink-on-dark)] placeholder:text-[var(--marketing-dim-on-dark)] focus:border-[var(--marketing-gold-500)] focus:outline-none"
        />
      </label>

      {error !== null && (
        <p
          role="alert"
          className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-950)] px-4 py-3 text-sm text-[var(--marketing-gold-400)]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="marketing-button-primary mt-2 w-full disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-xs leading-5 text-[var(--marketing-dim-on-dark)]">
        Credentials are hashed with PBKDF2 and never stored in plain text.
        Sessions last seven days.
      </p>
    </form>
  );
}
