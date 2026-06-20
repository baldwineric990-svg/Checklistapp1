const NZ_TZ = 'Pacific/Auckland';

function getNZTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: NZ_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parseInt(parts.find(p => p.type === type)?.value ?? '0');
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

/** Returns ms until the next reset at hour:minute in NZ time. */
function getMsUntilNextNZReset(hour: number, minute: number): number {
  const now = new Date();
  const nz = getNZTimeParts(now);

  const nzCurrentSecs = nz.hour * 3600 + nz.minute * 60 + nz.second;
  const nzResetSecs = hour * 3600 + minute * 60;

  let secsUntil = nzResetSecs - nzCurrentSecs;
  if (secsUntil <= 0) secsUntil += 24 * 3600;

  return secsUntil * 1000;
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

import { useState, useEffect } from 'react';

export function useCountdown(hour: number, minute: number) {
  const [ms, setMs] = useState(() => getMsUntilNextNZReset(hour, minute));

  useEffect(() => {
    setMs(getMsUntilNextNZReset(hour, minute));
    const id = setInterval(() => setMs(getMsUntilNextNZReset(hour, minute)), 1000);
    return () => clearInterval(id);
  }, [hour, minute]);

  return formatCountdown(ms);
}

export function formatResetTime(hour: number, minute: number): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const m = minute > 0 ? `:${String(minute).padStart(2, '0')}` : '';
  return `${h}${m} ${ampm} NZST`;
}

/**
 * Returns a string identifying the current NZ "reset period".
 * e.g. "2026-06-20-4" = tasks were last reset at 4AM NZ on June 20.
 */
export function getNZResetPeriod(hour: number, minute: number): string {
  const now = new Date();
  const nz = getNZTimeParts(now);

  const nzCurrentMins = nz.hour * 60 + nz.minute;
  const nzResetMins = hour * 60 + minute;

  // If we're past the reset time today in NZ, the current period is today
  if (nzCurrentMins >= nzResetMins) {
    return `${nz.year}-${String(nz.month).padStart(2, '0')}-${String(nz.day).padStart(2, '0')}-${hour}-${minute}`;
  }

  // Otherwise the current period started yesterday in NZ
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ynz = getNZTimeParts(yesterday);
  return `${ynz.year}-${String(ynz.month).padStart(2, '0')}-${String(ynz.day).padStart(2, '0')}-${hour}-${minute}`;
}
