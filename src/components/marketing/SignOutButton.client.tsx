import { useState } from 'react';

export default function SignOutButton(): React.JSX.Element {
  const [busy, setBusy] = useState(false);

  const signOut = async (): Promise<void> => {
    setBusy(true);

    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      window.location.assign('/');
    }
  };

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={busy}
      className="text-[var(--marketing-gold-400)] underline decoration-[var(--marketing-gold-line)] underline-offset-4 hover:text-[var(--marketing-gold-500)] disabled:opacity-50"
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
