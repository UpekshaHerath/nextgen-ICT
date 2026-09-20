"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLang } from "./LanguageProvider";
import { ThemeSwitch } from "./ThemeSwitch";
import { site, telLink, waLink } from "@/lib/site";

const SECTIONS = [
  { id: "about", key: "about" },
  { id: "classes", key: "classes" },
  { id: "timetable", key: "timetable" },
  { id: "syllabus", key: "syllabus" },
  { id: "gallery", key: "gallery" },
  { id: "faq", key: "faq" },
] as const;

function LangSwitch({ className = "" }: { className?: string }) {
  const { t, lang, setLang } = useLang();
  return (
    <div
      className={`flex border border-[var(--ink)] ${className}`}
      role="group"
      aria-label={t.common.langLabel}
    >
      {(["si", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`label relative px-2.5 py-1.5 transition-colors ${
            lang === l
              ? "text-[var(--panel-fg)]"
              : "text-[var(--ink)] hover:bg-[var(--mustard)] hover:text-[var(--on-accent)]"
          }`}
        >
          {lang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 bg-[var(--panel)]"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10">{l === "si" ? "සිං" : "EN"}</span>
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t, L } = useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // hide the bar while scrolling down, bring it back on the way up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (open) return;
    setHidden(y > 220 && y > prev);
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className="sticky top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.32, ease: [0.2, 0.8, 0.3, 1] }}
    >
      {/* hairline utility bar - phones get this information in the sheet instead */}
      <div className="hidden border-b border-[var(--ink)] bg-[var(--paper-2)] sm:block">
        <div className="shell flex items-center justify-between gap-4 py-1.5">
          <p className="label truncate text-[var(--ink-soft)]">
            {L(site.location)} · {L(site.medium)}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <a href={telLink} className="label whitespace-nowrap hover:text-[var(--maroon)]">
              ☏ {site.phoneDisplay}
            </a>
            <LangSwitch />
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <div className="shell flex items-center gap-3 py-2.5 sm:py-3">
          <a href="#home" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <motion.span
              whileHover={{ rotate: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="grid h-9 w-9 shrink-0 place-items-center border-2 border-[var(--ink)] bg-[var(--maroon)] font-[family-name:var(--font-mono)] text-[11px] font-semibold text-[var(--paper)] sm:h-11 sm:w-11 sm:text-[12px]"
            >
              ICT
            </motion.span>
            <span className="min-w-0 leading-none">
              <span className="display block truncate text-[17px] sm:text-[19px]">
                NextGen ICT
              </span>
              <span className="label mt-1 block truncate text-[var(--ink-soft)]">
                with Subhashana
              </span>
            </span>
          </a>

          <nav className="mx-auto hidden items-center gap-4 lg:flex xl:gap-6">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative whitespace-nowrap py-1 text-[13.5px] font-medium transition-colors hover:text-[var(--maroon)] xl:text-[14px] ${
                  active === s.id ? "text-[var(--maroon)]" : ""
                }`}
              >
                {t.nav[s.key]}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[var(--maroon)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <LangSwitch className="sm:hidden" />
            <ThemeSwitch className="sm:hidden" pillId="theme-pill-compact" />

            <a
              href={waLink(t.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="press hard-sm hidden border-2 border-[var(--ink)] bg-[var(--mustard)] px-3 py-2.5 text-[13px] font-semibold text-[var(--on-accent)] md:inline-block xl:px-4 xl:text-[13.5px]"
            >
              {t.nav.join}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[var(--ink)] lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 block h-[2px] w-full bg-[var(--ink)]"
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-1.5 block h-[2px] w-full bg-[var(--ink)]"
                />
                <motion.span
                  animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 block h-[2px] w-full bg-[var(--ink)]"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* mobile / tablet sheet */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="sheet"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.3, 1] }}
            className="overflow-hidden border-b-2 border-[var(--ink)] bg-[var(--paper-2)] lg:hidden"
          >
            <ul className="shell max-h-[calc(100dvh-140px)] overflow-y-auto py-2">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  className="border-b border-dashed border-[var(--ink)]/40"
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-3 py-3.5 text-[15px]"
                  >
                    <span className="label text-[var(--maroon)]">→</span>
                    {t.nav[s.key]}
                  </a>
                </motion.li>
              ))}
              <li className="grid gap-3 py-4 sm:flex sm:items-center sm:justify-between">
                <a href={telLink} className="label text-[var(--ink-soft)]">
                  ☏ {site.phoneDisplay} · {L(site.location)}
                </a>
                <a
                  href={waLink(t.wa.generic)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="press hard-sm block border-2 border-[var(--ink)] bg-[var(--mustard)] px-4 py-3 text-center text-[14px] font-semibold text-[var(--on-accent)] sm:inline-block"
                >
                  {t.nav.join}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
