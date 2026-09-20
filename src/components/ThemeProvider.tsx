"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

/** What the reader picked. `system` follows the OS until they say otherwise. */
export type Theme = "light" | "dark" | "system";
/** What is actually on screen once `system` is resolved. */
export type Resolved = "light" | "dark";

type Ctx = {
  theme: Theme;
  resolved: Resolved;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

export const THEME_STORAGE_KEY = "nextgen-theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inlined in <head> so the ground colour is right on the first paint. It only
 * stamps an explicit choice — a reader who has not chosen is already served by
 * the `prefers-color-scheme` block in globals.css, so there is nothing to do.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

/*
  The preference lives outside React — half in localStorage, half in the OS —
  so it is read as an external store rather than mirrored into state. The
  snapshot is one string, "<choice>|<what the OS says>", because
  useSyncExternalStore compares snapshots by identity.
*/

const listeners = new Set<() => void>();

/** Fired by setTheme; the storage event covers the site's other tabs. */
function announce() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): string {
  let choice: Theme = "system";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark") choice = raw;
  } catch {
    // storage blocked — follow the system
  }
  const system = window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
  return `${choice}|${system}`;
}

/** The server cannot know either half, so it renders the light default. */
function getServerSnapshot(): string {
  return "system|light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [choice, system] = snapshot.split("|") as [Theme, Resolved];
  const resolved: Resolved = choice === "system" ? system : choice;

  useEffect(() => {
    const root = document.documentElement;
    if (choice === "system") delete root.dataset.theme;
    else root.dataset.theme = choice;
  }, [choice]);

  const setTheme = useCallback((t: Theme) => {
    try {
      if (t === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      // storage blocked — the stamp below still flips this tab
    }
    const root = document.documentElement;
    if (t === "system") delete root.dataset.theme;
    else root.dataset.theme = t;
    announce();
  }, []);

  const toggle = useCallback(
    () => setTheme(resolved === "dark" ? "light" : "dark"),
    [resolved, setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme: choice, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
