"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLang } from "./LanguageProvider";
import { ThemeSwitch } from "./ThemeSwitch";
import { PhoneGlyph } from "./BrandIcons";
import { site, telLink, waLink } from "@/lib/site";

const SECTIONS = [
  { id: "about", key: "about" },
  { id: "classes", key: "classes" },
  { id: "timetable", key: "timetable" },
  { id: "syllabus", key: "syllabus" },
  { id: "gallery", key: "gallery" },
  { id: "faq", key: "faq" },
] as const;

/** Lets the page scroll again after the mobile sheet locked it. */
function unlockScroll() {
  document.body.style.overflow = "";
}

function LangSwitch({
  className = "",
  pillId = "lang-pill",
}: {
  className?: string;
  pillId?: string;
}) {
  const { t, lang, setLang } = useLang();
  return (
    <div
      className={`flex rounded-full border border-[var(--line)] bg-[var(--bg-soft)] p-0.5 ${className}`}
      role="group"
      aria-label={t.common.langLabel}
    >
      {(["si", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`relative h-7 rounded-full px-2.5 text-[12px] font-semibold transition-colors ${
            lang === l ? "text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          {lang === l && (
            <motion.span
              layoutId={pillId}
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
    return unlockScroll;
  }, [open]);

  // The sheet locks body scroll while open, and a native anchor jump fired in
  // that state is swallowed. Unlock first, then scroll on the next frame.
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      setOpen(false);
      return;
    }
    e.preventDefault();
    unlockScroll();
    setOpen(false);
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    });
  };

  return (
    <motion.header
      className="sticky top-0 z-50 pt-2 sm:pt-3"
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.32, ease: [0.2, 0.8, 0.3, 1] }}
    >
      <div className="shell relative">
        {/* floating glass island */}
        <div
          className={`glass flex items-center gap-3 rounded-full border py-1.5 pl-2 pr-1.5 transition-shadow duration-300 sm:py-2 sm:pl-2.5 sm:pr-2 ${
            scrolled
              ? "border-[var(--line-strong)] shadow-[var(--shadow)]"
              : "border-[var(--line)] shadow-[var(--shadow-sm)]"
          }`}
        >
          <a href="#home" className="flex min-w-0 items-center gap-2.5">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand)] font-[family-name:var(--font-mono)] text-[10.5px] font-bold text-[var(--on-brand)] sm:h-10 sm:w-10 sm:text-[11px]"
            >
              ICT
            </motion.span>
            <span className="min-w-0 leading-none">
              <span className="display block truncate text-[16px] sm:text-[17px]">
                NextGen ICT
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-medium text-[var(--muted)]">
                with Subhashana
              </span>
            </span>
          </a>

          <nav className="mx-auto hidden items-center xl:flex">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                  active === s.id
                    ? "text-[var(--fg)]"
                    : "text-[var(--muted)] hover:text-[var(--fg)]"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[var(--bg-soft)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{t.nav[s.key]}</span>
              </a>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
            <div className="hidden items-center gap-2 sm:flex">
              <LangSwitch />
              <ThemeSwitch />
            </div>
            <a
              href={waLink(t.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="press btn-brand hidden rounded-full px-4 py-2.5 text-[13px] font-semibold md:inline-block"
            >
              {t.nav.join}
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] xl:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 block h-[2px] w-full rounded-full bg-[var(--fg)]"
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-1.5 block h-[2px] w-full rounded-full bg-[var(--fg)]"
                />
                <motion.span
                  animate={open ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 block h-[2px] w-full rounded-full bg-[var(--fg)]"
                />
              </span>
            </button>
          </div>
        </div>

        {/* mobile / tablet sheet */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.3, 1] }}
              className="absolute inset-x-[clamp(1rem,4vw,1.5rem)] top-full mt-2 origin-top overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-lg)] xl:hidden"
            >
              <ul className="max-h-[calc(100dvh-110px)] overflow-y-auto p-2">
                {SECTIONS.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.22 }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => goTo(e, s.id)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-colors hover:bg-[var(--bg-soft)] ${
                        active === s.id ? "bg-[var(--bg-soft)] text-[var(--brand)]" : ""
                      }`}
                    >
                      {t.nav[s.key]}
                      <span aria-hidden className="text-[var(--muted)]">
                        →
                      </span>
                    </a>
                  </motion.li>
                ))}
                {/* phones only - from sm up these live in the bar */}
                <li className="mt-1 flex items-center justify-end gap-2 border-t border-[var(--line)] px-2 pt-3 sm:hidden">
                  <LangSwitch pillId="lang-pill-sheet" />
                  <ThemeSwitch pillId="theme-pill-sheet" />
                </li>
                <li className="mt-1 grid gap-3 border-t border-[var(--line)] px-2 pb-2 pt-3 sm:flex sm:items-center sm:justify-between">
                  <a
                    href={telLink}
                    className="inline-flex items-center gap-2 text-[13px] text-[var(--muted)]"
                  >
                    <PhoneGlyph className="h-3.5 w-3.5 shrink-0" />
                    {site.phoneDisplay} · {L(site.location)}
                  </a>
                  <a
                    href={waLink(t.wa.generic)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="press btn-brand block rounded-full px-5 py-3 text-center text-[14px] font-semibold sm:inline-block"
                  >
                    {t.nav.join}
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
