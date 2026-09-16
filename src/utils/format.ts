export function formatDateTime(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
  }).format(date);
}

export function formatPrice(value: string | number, currency?: string, unit?: string | null): string {
  const numeric = typeof value === 'number' ? value : Number(value);
  const amount = Number.isFinite(numeric)
    ? new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 8,
      }).format(numeric)
    : String(value);

  const parts = [amount];
  if (currency) {
    parts.push(currency);
  }
  if (unit) {
    parts.push(`/ ${unit}`);
  }
  return parts.join(' ');
}

export function excerpt(text: string, max = 140): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max).trim()}…`;
}
