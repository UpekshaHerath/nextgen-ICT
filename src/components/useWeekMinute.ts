"use client";

import { useSyncExternalStore } from "react";

const DAY = 24 * 60;

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 30_000);
  return () => window.clearInterval(id);
}

/** Minutes since Monday 00:00, local time. */
function snapshot() {
  const d = new Date();
  return ((d.getDay() + 6) % 7) * DAY + d.getHours() * 60 + d.getMinutes();
}

/**
 * The current minute of the week, ticking every 30 s. `null` on the server
 * and during hydration, so nothing time-dependent is baked into the HTML.
 */
export function useWeekMinute(): number | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

export const MINUTES_PER_DAY = DAY;
