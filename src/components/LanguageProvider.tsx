"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { dict, type Dict, type Lang } from "@/lib/i18n";
import type { Bi } from "@/lib/site";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Dict;
  /** Picks the current language out of a bilingual content field. */
  L: (field: Bi) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "nextgen-lang";

/*
  The choice lives in localStorage, outside React, so it is read as an
  external store rather than copied into state after mount.
*/

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "si" || saved === "en") return saved;
  } catch {
    // storage blocked — stay on the default language
  }
  return "si";
}

/** The server cannot see storage, so it renders the default language. */
function getServerSnapshot(): Lang {
  return "si";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
    listeners.forEach((fn) => fn());
  }, []);

  const toggle = useCallback(
    () => setLang(lang === "si" ? "en" : "si"),
    [lang, setLang],
  );

  const value: Ctx = {
    lang,
    setLang,
    toggle,
    t: dict[lang] as Dict,
    L: (field: Bi) => field[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
