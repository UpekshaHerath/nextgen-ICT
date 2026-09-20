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
      className={`flex rounded-full border border-[var(--line)] bg-[var(--surface-2)] p-0.5 ${className}`}
      role="group"
      aria-label={t.common.langLabel}
    >
      {(["si", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`relative rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
            lang === l ? "text-[var(--ink)]" : "text-[var(--ink-3)] hover:text-[var(--ink)]"
          }`}
        >
          {lang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-[var(--surface)] shadow-[var(--shadow-sm)]"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10">{l === "si" ? "සිං" : "EN"}</span>
        </button>
      ))}
    </div>
  );
}

/** Monogram mark — a copper square with the subject initials. */
function Mark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[10px] bg-[var(--accent)] text-[var(--on-accent)] ${
        size === "sm" ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11"
      }`}
    >
      <span className="eyebrow text-[10px] tracking-[0.08em]">ICT</span>
    </span>
  );
}

export function Nav() {
  const { t, L } = useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // hide the bar while scrolling down, bring it back on the way up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    if (open) return;
    setHidden(y > 240 && y > prev);
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
      {/* hairline utility bar — phones get this information in the sheet instead */}
      <div className="hidden border-b border-[var(--line)] bg-[var(--surface-2)] sm:block">
        <div className="shell flex items-center justify-between gap-4 py-1.5">
          <p className="truncate text-[12px] text-[var(--ink-3)]">
            {L(site.location)} · {L(site.medium)}
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href={telLink}
              className="whitespace-nowrap text-[12px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--accent)]"
            >
              {site.phoneDisplay}
            </a>
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <LangSwitch />
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* main bar */}
      <div
        className={`border-b bg-[var(--canvas)]/90 backdrop-blur-md transition-colors ${
          scrolled ? "border-[var(--line)]" : "border-transparent"
        }`}
      >
        <div className="shell flex items-center gap-3 py-3">
          <a href="#home" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Mark />
            <span className="min-w-0 leading-tight">
              <span className="display block truncate text-[17px] sm:text-[18px]">
                NextGen ICT
              </span>
              <span className="block truncate text-[11.5px] text-[var(--ink-3)]">
                with Subhashana
              </span>
            </span>
          </a>

          <nav className="mx-auto hidden items-center rounded-full border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[var(--shadow-sm)] lg:flex">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors xl:px-4 ${
                  active === s.id
                    ? "text-[var(--ink)]"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[var(--surface-2)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t.nav[s.key]}</span>
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
              className="btn btn-primary btn-sm hidden md:inline-flex"
            >
              {t.nav.join}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 block h-[1.5px] w-full rounded-full bg-[var(--ink)]"
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-1.5 block h-[1.5px] w-full rounded-full bg-[var(--ink)]"
                />
                <motion.span
                  animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 block h-[1.5px] w-full rounded-full bg-[var(--ink)]"
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
            className="overflow-hidden border-b border-[var(--line)] bg-[var(--canvas)] lg:hidden"
          >
            <ul className="shell max-h-[calc(100dvh-140px)] overflow-y-auto py-3">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  className="border-b border-[var(--line)] last:border-b-0"
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3.5 text-[15px] font-medium"
                  >
                    {t.nav[s.key]}
                    <span className="text-[var(--ink-3)]" aria-hidden>
                      →
                    </span>
                  </a>
                </motion.li>
              ))}
              <li className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 sm:flex sm:items-center sm:justify-between">
                <a href={telLink} className="text-[13px] text-[var(--ink-2)]">
                  {site.phoneDisplay} · {L(site.location)}
                </a>
                <a
                  href={waLink(t.wa.generic)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full sm:w-auto"
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
