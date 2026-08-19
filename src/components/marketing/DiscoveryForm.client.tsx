import { useEffect, useRef, useState } from 'react';
import {
  PASSWORD_HINT,
  getBrackets,
  intents,
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone,
  nextBusinessDays,
  segments,
  timezones,
  type Intent,
  type Segment,
} from '@/data/marketing/discovery';

const SLOT_TIMES = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'];

interface DiscoveryResult {
  ok: boolean;
  error?: string;
  errors?: Record<string, string>;
  member?: { name: string; email: string };
  alreadyMember?: boolean;
}

const formatSlotDate = (date: Date): string => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return `${weekdays[date.getUTCDay()]} ${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
};

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export default function DiscoveryForm(): React.JSX.Element {
  const [step, setStep] = useState(1);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [bracket, setBracket] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [timezone, setTimezone] = useState('GMT');
  const [slotDate, setSlotDate] = useState<string | null>(null);
  const [slotTime, setSlotTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<DiscoveryResult['member'] | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const dates = nextBusinessDays(new Date(), 5);
  const availableBrackets = intent === null ? [] : getBrackets(intent);
  const skipsBrackets = intent === 'stay';

  const validName = isValidName(name);
  const validEmail = isValidEmail(email);
  const validPhone = isValidPhone(phone);
  const validPassword = isValidPassword(password);
  const step4Complete = validName && validEmail && validPhone && validPassword;
  const step5Complete = slotDate !== null && slotTime !== null;

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return segment !== null;
      case 2:
        return intent !== null;
      case 3:
        return availableBrackets[0] === 'None yet' || bracket !== null;
      case 4:
        return step4Complete;
      default:
        return false;
    }
  };

  const goNext = (): void => {
    if (!canAdvance()) {
      return;
    }
    setSubmitError(null);
    if (step === 2 && intent === 'stay') {
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

  const goBack = (): void => {
    setSubmitError(null);
    if (step === 4 && intent === 'stay') {
      setStep(2);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const submit = async (): Promise<void> => {
    if (!step5Complete) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setServerErrors({});

    try {
      const response = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segment,
          intent,
          bracket,
          name,
          email,
          phone: phone.trim() === '' ? undefined : phone,
          password,
          timezone,
          slotDate: slotDate ?? undefined,
          slotTime,
        }),
      });
      const result = (await response.json()) as DiscoveryResult;

      if (!response.ok || !result.ok) {
        setServerErrors(result.errors ?? {});
        setSubmitError(
          result.error ??
            'Something went wrong. Please check the fields and try again.'
        );
        setSubmitting(false);
        return;
      }

      setDone(result.member ?? null);
    } catch {
      setSubmitError('The network is unreachable. Please try again.');
      setSubmitting(false);
    }
  };

  if (done !== null && done !== undefined) {
    return (
      <div
        ref={panelRef}
        className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] p-8 text-[var(--marketing-ink-on-dark)] lg:p-10"
      >
        <p className="marketing-ledger-label">STEP 5 / 5 · COMPLETE</p>
        <div className="mt-8 grid place-items-center text-center">
          <span className="grid size-16 place-items-center rounded-full border border-[var(--marketing-gold-500)] text-3xl text-[var(--marketing-gold-400)]">
            ✓
          </span>
          <h2 className="marketing-display mt-6 text-4xl text-[var(--marketing-gold-400)]">
            You are in.
          </h2>
          <p className="mt-4 max-w-sm leading-7 text-[var(--marketing-dim-on-dark)]">
            {done.name.split(' ')[0]}, your briefing is reserved and your member
            gate is open. The long-form documents are waiting on the other side.
          </p>
          <a
            className="marketing-button-primary mt-8 w-full max-w-sm"
            href="/members/documents/partnership-summary"
          >
            Download the Partnership Summary
          </a>
          <a
            className="mt-3 w-full max-w-sm text-center text-sm text-[var(--marketing-gold-400)] underline decoration-[var(--marketing-gold-line)] underline-offset-4"
            href="/members"
          >
            Go to your documents
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-900)] p-8 text-[var(--marketing-ink-on-dark)] lg:p-10"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="marketing-ledger-label">STEP {step} / 5</p>
        <p className="marketing-display text-lg text-[var(--marketing-gold-400)]">
          Discovery briefing
        </p>
      </div>
      <div className="mt-3 h-px bg-[var(--marketing-gold-line)]">
        <div
          className="h-px bg-[var(--marketing-gold-500)] transition-all duration-500"
          style={{ width: `${Math.round((step / 5) * 100)}%` }}
        />
      </div>

      <div className="mt-8" key={`step-${step}`}>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="marketing-display text-3xl text-[var(--marketing-ink-on-dark)] focus:outline-none"
        >
          {step === 1 && 'Who are you?'}
          {step === 2 && 'Why are you here?'}
          {step === 3 && 'Your capital plans'}
          {step === 4 && 'Contact details'}
          {step === 5 && 'Briefing schedule'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--marketing-dim-on-dark)]">
          {step === 1 &&
            'Choose the profile that fits. The next steps branch from here.'}
          {step === 2 && 'Everything after this adapts to your answer.'}
          {step === 3 &&
            (intent === 'prefab'
              ? 'The owner path starts at a $50,000 entry.'
              : intent === 'ecosystem'
                ? 'The Ecosystem Fund deploys at village scale.'
                : 'No capital commitment yet.')}
          {step === 4 &&
            'Choose the credentials you will use to open your gate.'}
          {step === 5 &&
            'Pick a 45-minute window in your timezone. Your calendar invite is encrypted.'}
        </p>
      </div>

      <div className="mt-8" key={`body-${step}`}>
        {step === 1 && (
          <fieldset className="grid gap-3">
            <legend className="sr-only">Who are you?</legend>
            {segments.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSegment(option.id)}
                aria-pressed={segment === option.id}
                className={`grid gap-1 border px-4 py-3 text-left transition-colors ${
                  segment === option.id
                    ? 'border-[var(--marketing-gold-500)] bg-[var(--marketing-obsidian-950)]'
                    : 'border-[var(--marketing-gold-line)] hover:border-[var(--marketing-gold-500)]'
                }`}
              >
                <span className="text-sm font-medium text-[var(--marketing-ink-on-dark)]">
                  {option.label}
                </span>
                <span className="text-xs leading-5 text-[var(--marketing-dim-on-dark)]">
                  {option.description}
                </span>
              </button>
            ))}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="grid gap-3">
            <legend className="sr-only">Why are you here?</legend>
            {intents.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => setIntent(option.id)}
                aria-pressed={intent === option.id}
                className={`grid gap-1 border px-4 py-3 text-left transition-colors ${
                  intent === option.id
                    ? 'border-[var(--marketing-gold-500)] bg-[var(--marketing-obsidian-950)]'
                    : 'border-[var(--marketing-gold-line)] hover:border-[var(--marketing-gold-500)]'
                }`}
              >
                <span className="text-sm font-medium text-[var(--marketing-ink-on-dark)]">
                  {option.label}
                </span>
                <span className="text-xs leading-5 text-[var(--marketing-dim-on-dark)]">
                  {option.description}
                </span>
              </button>
            ))}
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="grid gap-3">
            <legend className="sr-only">Your capital plans</legend>
            {availableBrackets.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setBracket(option)}
                aria-pressed={bracket === option}
                className={`border px-4 py-3 text-left text-sm font-medium transition-colors ${
                  bracket === option
                    ? 'border-[var(--marketing-gold-500)] bg-[var(--marketing-obsidian-950)] text-[var(--marketing-gold-400)]'
                    : 'border-[var(--marketing-gold-line)] text-[var(--marketing-ink-on-dark)] hover:border-[var(--marketing-gold-500)]'
                }`}
              >
                {option}
              </button>
            ))}
          </fieldset>
        )}

        {step === 4 && (
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm">
              <span className="text-[var(--marketing-dim-on-dark)]">
                Full name
              </span>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className={`w-full border bg-[var(--marketing-obsidian-950)] px-4 py-3 pr-10 text-[var(--marketing-ink-on-dark)] placeholder:text-[var(--marketing-dim-on-dark)] focus:outline-none ${
                    name === ''
                      ? 'border-[var(--marketing-gold-line)]'
                      : validName
                        ? 'border-[var(--marketing-gold-500)]'
                        : 'border-red-400/70'
                  }`}
                />
                {name !== '' && validName && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--marketing-gold-400)]">
                    ✓
                  </span>
                )}
              </div>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-[var(--marketing-dim-on-dark)]">Email</span>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  aria-describedby={
                    serverErrors.email !== undefined ? 'email-error' : undefined
                  }
                  className={`w-full border bg-[var(--marketing-obsidian-950)] px-4 py-3 pr-10 text-[var(--marketing-ink-on-dark)] placeholder:text-[var(--marketing-dim-on-dark)] focus:outline-none ${
                    email === ''
                      ? 'border-[var(--marketing-gold-line)]'
                      : validEmail
                        ? 'border-[var(--marketing-gold-500)]'
                        : 'border-red-400/70'
                  }`}
                />
                {email !== '' && validEmail && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--marketing-gold-400)]">
                    ✓
                  </span>
                )}
              </div>
              {serverErrors.email !== undefined && (
                <span id="email-error" className="text-xs text-red-300">
                  {serverErrors.email}
                </span>
              )}
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-[var(--marketing-dim-on-dark)]">
                Phone <span className="opacity-60">(optional)</span>
              </span>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder="+233 …"
                  className={`w-full border bg-[var(--marketing-obsidian-950)] px-4 py-3 pr-10 text-[var(--marketing-ink-on-dark)] placeholder:text-[var(--marketing-dim-on-dark)] focus:outline-none ${
                    phone === ''
                      ? 'border-[var(--marketing-gold-line)]'
                      : validPhone
                        ? 'border-[var(--marketing-gold-500)]'
                        : 'border-red-400/70'
                  }`}
                />
                {phone !== '' && validPhone && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--marketing-gold-400)]">
                    ✓
                  </span>
                )}
              </div>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-[var(--marketing-dim-on-dark)]">
                Create your member password
              </span>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  className={`w-full border bg-[var(--marketing-obsidian-950)] px-4 py-3 pr-10 text-[var(--marketing-ink-on-dark)] placeholder:text-[var(--marketing-dim-on-dark)] focus:outline-none ${
                    password === ''
                      ? 'border-[var(--marketing-gold-line)]'
                      : validPassword
                        ? 'border-[var(--marketing-gold-500)]'
                        : 'border-red-400/70'
                  }`}
                />
                {password !== '' && validPassword && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--marketing-gold-400)]">
                    ✓
                  </span>
                )}
              </div>
              <span className="text-xs leading-5 text-[var(--marketing-dim-on-dark)]">
                {PASSWORD_HINT}
              </span>
            </label>
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-6">
            <label className="grid gap-2 text-sm">
              <span className="text-[var(--marketing-dim-on-dark)]">
                Your timezone
              </span>
              <select
                value={timezone}
                onChange={event => setTimezone(event.target.value)}
                className="w-full border border-[var(--marketing-gold-line)] bg-[var(--marketing-obsidian-950)] px-4 py-3 text-[var(--marketing-ink-on-dark)] focus:border-[var(--marketing-gold-500)] focus:outline-none"
              >
                {timezones.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label} · UTC{option.offset >= 0 ? '+' : ''}
                    {option.offset}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="grid gap-2 text-sm">
              <legend className="text-[var(--marketing-dim-on-dark)]">
                Pick a day
              </legend>
              <div className="grid grid-cols-5 gap-2">
                {dates.map(date => {
                  const iso = toIsoDate(date);
                  const selected = slotDate === iso;

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        setSlotDate(iso);
                        setSlotTime(null);
                      }}
                      aria-pressed={selected}
                      className={`border px-2 py-3 text-center text-xs transition-colors ${
                        selected
                          ? 'border-[var(--marketing-gold-500)] bg-[var(--marketing-obsidian-950)] text-[var(--marketing-gold-400)]'
                          : 'border-[var(--marketing-gold-line)] text-[var(--marketing-ink-on-dark)] hover:border-[var(--marketing-gold-500)]'
                      }`}
                    >
                      {formatSlotDate(date)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {slotDate !== null && (
              <fieldset className="grid gap-2 text-sm">
                <legend className="text-[var(--marketing-dim-on-dark)]">
                  45-minute call
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {SLOT_TIMES.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSlotTime(time)}
                      aria-pressed={slotTime === time}
                      className={`border px-3 py-2.5 text-center text-xs transition-colors ${
                        slotTime === time
                          ? 'border-[var(--marketing-gold-500)] bg-[var(--marketing-obsidian-950)] text-[var(--marketing-gold-400)]'
                          : 'border-[var(--marketing-gold-line)] text-[var(--marketing-ink-on-dark)] hover:border-[var(--marketing-gold-500)]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <p className="flex items-center gap-2 text-xs text-[var(--marketing-dim-on-dark)]">
              <span aria-hidden="true">🔒</span>
              Secure global sync — end-to-end encryption active
            </p>
          </div>
        )}
      </div>

      {submitError !== null && (
        <p
          role="alert"
          className="mt-6 border border-red-400/50 bg-[var(--marketing-obsidian-950)] px-4 py-3 text-sm text-red-300"
        >
          {submitError}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="text-sm text-[var(--marketing-dim-on-dark)] underline decoration-[var(--marketing-gold-line)] underline-offset-4 disabled:opacity-40"
        >
          Back
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance()}
            className="marketing-button-primary disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!step5Complete || submitting}
            className="marketing-button-primary disabled:opacity-40"
          >
            {submitting ? 'Reserving…' : 'Reserve my briefing'}
          </button>
        )}
      </div>
    </div>
  );
}
