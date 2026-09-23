"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import type { Dict } from "@/lib/i18n";
import { classes, isOL, waLink, type Bi, type ClassInfo } from "@/lib/site";

type Filter = "all" | "12" | "13" | "11" | "online";

export function Classes() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.classes.filterAll },
    { key: "13", label: t.classes.grade13 },
    { key: "12", label: t.classes.grade12 },
    { key: "11", label: t.classes.grade11 },
    { key: "online", label: t.classes.online },
  ];

  const list = useMemo(
    () =>
      classes.filter((c) =>
        filter === "all"
          ? true
          : filter === "online"
            ? c.mode !== "physical"
            : filter === "11"
              ? isOL(c)
              : c.grade === filter,
      ),
    [filter],
  );

  return (
    <section
      id="classes"
      className="border-b-2 border-[var(--ink)] bg-[var(--paper-2)] py-14 sm:py-20"
    >
      <div className="shell">
        <SectionHead
          no="02"
          eyebrow={t.classes.eyebrow}
          title={t.classes.title}
          sub={t.classes.sub}
        />

        {/* filters scroll sideways on phones rather than wrapping into rows */}
        <div className="thin-scroll -mx-[clamp(1rem,4vw,1.5rem)] mt-6 overflow-x-auto px-[clamp(1rem,4vw,1.5rem)] pb-1 sm:mx-0 sm:mt-7 sm:px-0 sm:pb-0">
          <div className="flex w-max min-w-full border-2 border-[var(--ink)] bg-[var(--paper)]">
            {filters.map((f, i) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`relative shrink-0 whitespace-nowrap px-4 py-2.5 text-[13px] font-semibold transition-colors sm:px-5 sm:py-3 sm:text-[13.5px] ${
                  i > 0 ? "border-l-2 border-[var(--ink)]" : ""
                } ${
                  filter === f.key
                    ? "text-[var(--panel-fg)]"
                    : "hover:bg-[var(--mustard)] hover:text-[var(--on-accent)]"
                }`}
              >
                {filter === f.key && (
                  <motion.span
                    layoutId="class-filter"
                    className="absolute inset-0 bg-[var(--panel)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-7 grid gap-6 sm:mt-8 sm:gap-7 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.3, 1] }}
              >
                <ClassCard c={c} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

/** WhatsApp link pre-filled with the class the student wants to join. */
export function joinLink(c: ClassInfo, t: Dict, L: (f: Bi) => string) {
  return waLink(
    `${t.wa.classPrefix}\n\n• ${L(c.title)}\n• ${L(c.institute)}, ${L(c.town)}\n• ${L(c.day)} ${L(c.time)}`,
  );
}

/** Admission-ticket card: stub header, perforated split, details below. */
function ClassCard({ c }: { c: ClassInfo }) {
  const { t, L } = useLang();
  const reduce = useReducedMotion();

  const modeLabel =
    c.mode === "online"
      ? t.classes.online
      : c.mode === "hybrid"
        ? t.classes.hybrid
        : t.classes.physical;

  return (
    <motion.article
      whileHover={reduce ? {} : { y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="ticket hard flex h-full flex-col border-2 border-[var(--ink)] bg-[var(--paper)]"
    >
      {/* stub */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b-2 border-[var(--ink)] bg-[var(--panel)] px-4 py-2.5 sm:px-5 sm:py-3">
        <span className="label text-[var(--mustard)]">{L(c.kind)}</span>
        <span className="label text-[var(--panel-fg)] opacity-70">
          {c.grade === "all" ? "ALL" : c.grade === "ol" ? "O/L" : `GRADE ${c.grade}`} ·{" "}
          {c.examYear}
        </span>
      </div>

      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
        <h3 className="display text-[clamp(1.15rem,4.4vw,1.6rem)]">{L(c.title)}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-soft)] sm:mt-2.5 sm:text-[13.5px]">
          {L(c.desc)}
        </p>
      </div>

      <div className="dashed-rule mx-4 sm:mx-5" />

      <dl className="grid px-4 sm:px-5">
        <Row k={c.mode === "physical" ? "☖" : "✽"} v={modeLabel} />
        <Row k="▣" v={`${L(c.institute)} - ${L(c.town)}`} />
        <Row k="▤" v={L(c.day)} />
        <Row k="◷" v={L(c.time)} warn={!c.verified} />
      </dl>

      <ul className="mt-3.5 flex flex-wrap gap-2 px-4 sm:mt-4 sm:px-5">
        {c.highlights.map((h) => (
          <li
            key={h.en}
            className="border border-[var(--ink)] bg-[var(--paper-2)] px-2.5 py-1 text-[11.5px]"
          >
            {L(h)}
          </li>
        ))}
      </ul>

      <div className="mt-auto p-4 sm:p-5">
        <a
          href={joinLink(c, t, L)}
          target="_blank"
          rel="noopener noreferrer"
          className="press hard-sm flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--green)] px-4 py-3 text-[13.5px] font-bold text-[var(--paper)] sm:px-5 sm:text-[14px]"
        >
          <WhatsAppGlyph className="h-4 w-4 shrink-0" />
          {c.verified ? t.classes.join : t.classes.confirm}
        </a>
      </div>
    </motion.article>
  );
}

function Row({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className="flex items-baseline gap-2.5 border-b border-dotted border-[var(--ink)]/40 py-2.5 text-[13px] last:border-b-0 sm:gap-3 sm:text-[13.5px]">
      <span aria-hidden className="w-4 shrink-0 text-[var(--maroon)]">
        {k}
      </span>
      <span className={warn ? "font-semibold text-[var(--maroon)]" : ""}>{v}</span>
    </div>
  );
}
