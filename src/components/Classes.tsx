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
      className="bg-[var(--bg-soft)] py-16 sm:py-24"
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
          <div className="mt-7 rounded-3xl border border-dashed border-[var(--line-strong)] px-5 py-10 text-center">
            <p className="text-[14px]">{t.classes.empty}</p>
            <button
              type="button"
              onClick={() => {
                setBatch("all");
                setVenue("all");
              }}
              className="press btn-ghost mt-4 rounded-full px-4 py-2 text-[13px] font-semibold"
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
      <span className="w-20 shrink-0 text-[12.5px] font-semibold text-[var(--muted)]">
        {label}
      </span>
      <div className="thin-scroll -mx-[clamp(1rem,4vw,1.5rem)] min-w-0 overflow-x-auto px-[clamp(1rem,4vw,1.5rem)] pb-1 sm:mx-0 sm:px-0 sm:pb-0">
        <div
          role="group"
          aria-label={label}
          className="flex w-max rounded-full border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[var(--shadow-sm)]"
        >
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              aria-pressed={value === o.key}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-colors sm:px-5 sm:text-[13.5px] ${
                value === o.key ? "text-[var(--on-brand)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {value === o.key && (
                <motion.span
                  layoutId={id}
                  className="absolute inset-0 rounded-full bg-[image:var(--grad)] shadow-[var(--glow)]"
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

/** Batch card: coloured header glow, weekly sessions, one call to action. */
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
      whileHover={reduce ? {} : { y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="card ring-grad relative flex h-full flex-col overflow-hidden rounded-3xl hover:shadow-[var(--shadow-lg)]"
    >
      {/* soft batch-coloured wash across the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
        style={{
          background: `radial-gradient(120% 100% at 0% 0%, color-mix(in srgb, ${color} 22%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative flex flex-wrap items-center justify-between gap-2 px-5 pt-5 sm:px-6 sm:pt-6">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold"
          style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
        >
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />
          {L(b.kind)}
        </span>
        <span className="label text-[var(--muted)]">
          {b.level === "al" ? "G.C.E. A/L" : "G.C.E. O/L"}
        </span>
      </div>

      <div className="relative px-5 pt-4 sm:px-6">
        <h3 className="display text-[clamp(1.2rem,4.4vw,1.6rem)]">{L(b.title)}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)] sm:text-[14px]">
          {L(b.desc)}
        </p>
      </div>

      <div className="relative mx-5 mt-5 rounded-2xl border border-[var(--line)] bg-[var(--bg)] sm:mx-6">
        <p className="label px-4 pt-3 text-[var(--muted)]">{t.classes.weekly}</p>
        <ul className="px-4 pb-1">
          {sessions.map((c) => (
            <li
              key={c.id}
              className="grid grid-cols-[5.5rem_1fr] gap-x-3 border-b border-[var(--line)] py-3 text-[13px] last:border-b-0 sm:grid-cols-[6.5rem_1fr] sm:text-[13.5px]"
            >
              <span className="font-bold" style={{ color }}>
                {L(c.day)}
              </span>
              <span className="min-w-0">
                <span className="block font-[family-name:var(--font-mono)] text-[12.5px] font-medium">
                  {L(c.time)}
                  {c.label && (
                    <span className="ml-2 rounded-full bg-[var(--bg-soft)] px-2 py-0.5 font-[family-name:var(--font-ui)] text-[11px] font-semibold">
                      {L(c.label)}
                    </span>
                  )}
                </span>
                <span className="block text-[var(--muted)]">
                  {L(c.institute)} - {L(c.town)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="relative mt-4 flex flex-wrap gap-2 px-5 sm:px-6">
        {b.highlights.map((h) => (
          <li
            key={h.en}
            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[12px] font-medium text-[var(--muted)]"
          >
            {L(h)}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto p-5 sm:p-6">
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="press btn-green flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold"
        >
          <WhatsAppGlyph className="h-4 w-4 shrink-0" />
          {t.classes.join}
        </a>
      </div>
    </motion.article>
  );
}
