export type Segment = 'local' | 'diaspora' | 'institutional';
export type Intent = 'prefab' | 'ecosystem' | 'stay' | 'exploring';

export interface SegmentOption {
  id: Segment;
  label: string;
  description: string;
}

export interface IntentOption {
  id: Intent;
  label: string;
  description: string;
}

export interface TimezoneOption {
  id: string;
  label: string;
  offset: number;
}

export const segments: readonly SegmentOption[] = [
  {
    id: 'local',
    label: 'Local Ghanaian',
    description:
      'Building and investing in the communities we already live in.',
  },
  {
    id: 'diaspora',
    label: 'Diaspora Partner',
    description: 'Owning a piece of home from abroad, managed end to end.',
  },
  {
    id: 'institutional',
    label: 'Institutional Fund',
    description:
      'Deploying capital at village scale through the Ecosystem Fund.',
  },
];

export const intents: readonly IntentOption[] = [
  {
    id: 'prefab',
    label: 'Set up a prefab',
    description: 'Own a P7 capsule and share the revenue of the village.',
  },
  {
    id: 'ecosystem',
    label: 'Invest in the Ecosystem Fund',
    description: 'Fund multiple capsules and villages as a single position.',
  },
  {
    id: 'stay',
    label: 'Book a stay',
    description: 'Spend a week in a village before you commit.',
  },
  {
    id: 'exploring',
    label: 'Exploring',
    description: 'Learn what a village could mean for you or your family.',
  },
];

export const ownerBrackets: readonly string[] = [
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  '$250,000 – $500,000',
  '$500,000 – $1M',
  '$1M+',
];

export const fundBrackets: readonly string[] = [
  '$1M – $5M',
  '$5M – $10M',
  '$10M – $25M',
  '$25M+',
];

const exploringBrackets: readonly string[] = ['None yet'];

export const timezones: readonly TimezoneOption[] = [
  { id: 'PST', label: 'Pacific (PST)', offset: -8 },
  { id: 'EST', label: 'Eastern (EST)', offset: -5 },
  { id: 'GMT', label: 'London (GMT)', offset: 0 },
  { id: 'CET', label: 'Central Europe (CET)', offset: 1 },
  { id: 'HKT', label: 'Hong Kong (HKT)', offset: 8 },
  { id: 'JST', label: 'Tokyo (JST)', offset: 9 },
];

export const getBrackets = (intent: Intent): readonly string[] => {
  switch (intent) {
    case 'prefab':
      return ownerBrackets;
    case 'ecosystem':
      return fundBrackets;
    case 'stay':
      return [];
    case 'exploring':
      return exploringBrackets;
  }
};

export const nextBusinessDays = (from: Date, count: number): Date[] => {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() + 1);

  while (days.length < count) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(cursor));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
};

export interface DiscoveryInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  segment: string;
  intent: string;
  bracket?: string;
  timezone: string;
  slotDate: string;
  slotTime: string;
}

export type DiscoveryValidation =
  { ok: true } | { ok: false; errors: Record<string, string> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s\-()]{6,19}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

export const validateDiscoveryInput = (
  input: DiscoveryInput,
  now: Date = new Date()
): DiscoveryValidation => {
  const errors: Record<string, string> = {};
  const name = input.name.trim();
  const email = input.email.trim();

  if (name.length < 2) {
    errors.name = 'Please tell us your name.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'That email address does not look right.';
  }

  if (input.phone !== undefined && input.phone.trim() !== '') {
    if (!PHONE_PATTERN.test(input.phone.trim())) {
      errors.phone = 'That phone number does not look right.';
    }
  }

  if (!PASSWORD_PATTERN.test(input.password)) {
    errors.password =
      'Use at least 10 characters with an uppercase letter, a lowercase letter, and a digit.';
  }

  if (!segments.some(option => option.id === input.segment)) {
    errors.segment = 'Choose who you are.';
  }

  if (!intents.some(option => option.id === input.intent)) {
    errors.intent = 'Choose what brings you here.';
  }

  const hasValidIntent = intents.some(option => option.id === input.intent);
  if (hasValidIntent) {
    const available = getBrackets(input.intent as Intent);
    if (available.length > 0 && available[0] !== 'None yet') {
      if (!input.bracket || !available.includes(input.bracket)) {
        errors.bracket = 'Choose a range from the list.';
      }
    } else if (input.bracket !== undefined && input.bracket !== 'None yet') {
      errors.bracket = 'Choose "None yet".';
    }
  }

  if (!timezones.some(option => option.id === input.timezone)) {
    errors.timezone = 'Choose your timezone.';
  }

  if (!DATE_PATTERN.test(input.slotDate)) {
    errors.slotDate = 'Choose a date.';
  } else {
    const slot = new Date(`${input.slotDate}T12:00:00Z`);
    const startOfToday = new Date(now);
    startOfToday.setUTCHours(0, 0, 0, 0);

    if (Number.isNaN(slot.getTime())) {
      errors.slotDate = 'Choose a date.';
    } else if (slot.getTime() < startOfToday.getTime()) {
      errors.slotDate = 'Choose a date from today.';
    } else if (isWeekend(slot)) {
      errors.slotDate = 'Briefings run on weekdays.';
    }
  }

  if (!/^\d{2}:\d{2}$/.test(input.slotTime)) {
    errors.slotTime = 'Choose a time.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true };
};
