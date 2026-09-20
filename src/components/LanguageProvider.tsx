"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("si");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "si" || saved === "en") setLangState(saved);
    } catch {
      // storage blocked — stay on the default language
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
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
