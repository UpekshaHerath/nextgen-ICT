"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import {
  batches,
  classes,
  venues,
  waLink,
  type Batch,
  type BatchId,
  type ClassInfo,
  type VenueId,
} from "@/lib/site";

type BatchFilter = BatchId | "all";
type VenueFilter = VenueId | "all";

export function Classes() {
  const { t, L } = useLang();
  const [batch, setBatch] = useState<BatchFilter>("all");
  const [venue, setVenue] = useState<VenueFilter>("all");

  const batchOptions: { key: BatchFilter; label: string }[] = [
    { key: "all", label: t.classes.filterAll },
    ...batches.map((b) => ({ key: b.id, label: L(b.name) })),
  ];
  const venueOptions: { key: VenueFilter; label: string }[] = [
    { key: "all", label: t.classes.venueAll },
    ...venues.map((v) => ({ key: v.id, label: L(v.town) })),
  ];

  // one card per batch, holding only the sessions that pass the venue filter
  const cards = useMemo(
    () =>
      batches
        .filter((b) => batch === "all" || b.id === batch)
        .map((b) => ({
          b,
          sessions: classes.filter(
            (c) =>
              c.batch.id === b.id && (venue === "all" || c.venue.id === venue),
          ),
        }))
        .filter((x) => x.sessions.length > 0),
    [batch, venue],
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

        <div className="mt-6 grid gap-3 sm:mt-7">
          <FilterBar
            id="class-batch"
            label={t.classes.byBatch}
            options={batchOptions}
            value={batch}
            onChange={setBatch}
          />
          <FilterBar
            id="class-venue"
            label={t.classes.byVenue}
            options={venueOptions}
            value={venue}
            onChange={setVenue}
          />
        </div>

        <motion.ul
          layout
          className="mt-7 grid gap-6 sm:mt-8 sm:gap-7 lg:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {cards.map(({ b, sessions }) => (
              <motion.li
                key={b.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.18 },
                }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.3, 1] }}
              >
                <BatchCard b={b} sessions={sessions} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {cards.length === 0 && (
          <div className="mt-7 border-2 border-dashed border-[var(--ink)]/50 px-5 py-8 text-center">
            <p className="text-[14px]">{t.classes.empty}</p>
            <button
              type="button"
              onClick={() => {
                setBatch("all");
                setVenue("all");
              }}
              className="mt-3 text-[13px] font-semibold text-[var(--maroon)] underline decoration-dotted underline-offset-4"
            >
              {t.classes.reset}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** Segmented filter; scrolls sideways on phones rather than wrapping into rows. */
function FilterBar<K extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <span className="label w-20 shrink-0 text-[var(--ink-soft)]">
        {label}
      </span>
      <div className="thin-scroll -mx-[clamp(1rem,4vw,1.5rem)] min-w-0 overflow-x-auto px-[clamp(1rem,4vw,1.5rem)] pb-1 sm:mx-0 sm:px-0 sm:pb-0">
        <div
          role="group"
          aria-label={label}
          className="flex w-max border-2 border-[var(--ink)] bg-[var(--paper)]"
        >
          {options.map((o, i) => (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              aria-pressed={value === o.key}
              className={`relative shrink-0 whitespace-nowrap px-4 py-2.5 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[13.5px] ${
                i > 0 ? "border-l-2 border-[var(--ink)]" : ""
              } ${
                value === o.key
                  ? "text-[var(--panel-fg)]"
                  : "hover:bg-[var(--mustard)] hover:text-[var(--on-accent)]"
              }`}
            >
              {value === o.key && (
                <motion.span
                  layoutId={id}
                  className="absolute inset-0 bg-[var(--panel)]"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Admission-ticket card: stub header, perforated split, weekly sessions below. */
function BatchCard({ b, sessions }: { b: Batch; sessions: ClassInfo[] }) {
  const { t, L } = useLang();
  const reduce = useReducedMotion();
  const color = `var(--batch-${b.id})`;

  const message = [
    t.wa.classPrefix,
    "",
    `• ${L(b.title)}`,
    ...sessions.map(
      (c) =>
        `• ${c.label ? `${L(c.label)}: ` : ""}${L(c.day)} ${L(c.time)} - ${L(c.institute)}, ${L(c.town)}`,
    ),
  ].join("\n");

  return (
    <motion.article
      whileHover={reduce ? {} : { y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="ticket hard flex h-full flex-col border-2 border-[var(--ink)] bg-[var(--paper)]"
    >
      {/* stub */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b-2 border-[var(--ink)] bg-[var(--panel)] px-4 py-2.5 sm:px-5 sm:py-3">
        <span className="label inline-flex items-center gap-2 text-[var(--mustard)]">
          <span
            aria-hidden
            className="h-3 w-3 border border-[var(--panel-fg)]/60"
            style={{ background: color }}
          />
          {L(b.kind)}
        </span>
        <span className="label text-[var(--panel-fg)] opacity-70">
          {b.level === "al" ? "G.C.E. A/L" : "G.C.E. O/L"}
        </span>
      </div>

      <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
        <h3 className="display text-[clamp(1.15rem,4.4vw,1.6rem)]">
          {L(b.title)}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-soft)] sm:mt-2.5 sm:text-[13.5px]">
          {L(b.desc)}
        </p>
      </div>

      <div className="dashed-rule mx-4 sm:mx-5" />

      <p className="label px-4 pt-3.5 text-[var(--ink-soft)] sm:px-5">
        {t.classes.weekly}
      </p>
      <ul className="px-4 sm:px-5">
        {sessions.map((c) => (
          <li
            key={c.id}
            className="grid grid-cols-[5.5rem_1fr] gap-x-3 border-b border-dotted border-[var(--ink)]/40 py-2.5 text-[13px] last:border-b-0 sm:grid-cols-[6.5rem_1fr] sm:text-[13.5px]"
          >
            <span className="font-bold" style={{ color }}>
              {L(c.day)}
            </span>
            <span className="min-w-0">
              <span className="block font-[family-name:var(--font-mono)] text-[12.5px]">
                {L(c.time)}
                {c.label && (
                  <span className="ml-2 border border-[var(--ink)]/50 px-1.5 py-px font-[family-name:var(--font-ui)] text-[11px] font-semibold">
                    {L(c.label)}
                  </span>
                )}
              </span>
              <span className="block text-[var(--ink-soft)]">
                {L(c.institute)} - {L(c.town)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-3.5 flex flex-wrap gap-2 px-4 sm:mt-4 sm:px-5">
        {b.highlights.map((h) => (
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
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="press hard-sm flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--green)] px-4 py-3 text-[13.5px] font-bold text-[var(--paper)] sm:px-5 sm:text-[14px]"
        >
          <WhatsAppGlyph className="h-4 w-4 shrink-0" />
          {t.classes.join}
        </a>
      </div>
    </motion.article>
  );
}
