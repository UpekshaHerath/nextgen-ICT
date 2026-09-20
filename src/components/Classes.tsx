"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import { classes, waLink, type ClassInfo } from "@/lib/site";

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
            : c.grade === filter,
      ),
    [filter],
  );

  return (
    <section
      id="classes"
      className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface-2)] py-20 sm:scroll-mt-28 sm:py-28"
    >
      <div className="shell">
        <SectionHead
          no="02"
          eyebrow={t.classes.eyebrow}
          title={t.classes.title}
          sub={t.classes.sub}
        />

        {/* filters scroll sideways on phones rather than wrapping into rows */}
        <div className="thin-scroll -mx-[clamp(1rem,4vw,2rem)] mt-8 overflow-x-auto px-[clamp(1rem,4vw,2rem)] pb-2 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ${
                  filter === f.key
                    ? "text-[var(--on-accent)]"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                {filter === f.key && (
                  <motion.span
                    layoutId="class-filter"
                    className="absolute inset-0 rounded-full bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-8 grid gap-6 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
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

/** One class: kind and grade on top, details in a definition row, CTA at the foot. */
function ClassCard({ c }: { c: ClassInfo }) {
  const { t, L, lang } = useLang();

  const modeLabel =
    c.mode === "online"
      ? t.classes.online
      : c.mode === "hybrid"
        ? t.classes.hybrid
        : t.classes.physical;

  const gradeLabel =
    c.grade === "all"
      ? lang === "si"
        ? "සියලු ශ්‍රේණි"
        : "All grades"
      : c.grade === "13"
        ? t.classes.grade13
        : c.grade === "12"
          ? t.classes.grade12
          : t.classes.grade11;

  const message = `${t.wa.classPrefix}\n\n• ${L(c.title)}\n• ${L(c.institute)}, ${L(c.town)}\n• ${L(c.day)} ${L(c.time)}`;

  return (
    <article className="card card-lift flex h-full flex-col p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip chip-accent">{L(c.kind)}</span>
        <span className="chip">{gradeLabel}</span>
        {/* the kind already says "Online" for those classes — don't repeat it */}
        {L(c.kind) !== modeLabel && <span className="chip">{modeLabel}</span>}
        <span className="num ml-auto text-[12px] text-[var(--ink-3)]">{c.examYear}</span>
      </div>

      <h3 className="display mt-5 text-[clamp(1.2rem,2.6vw,1.5rem)]">{L(c.title)}</h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--ink-2)]">{L(c.desc)}</p>

      <dl className="mt-6 grid gap-px overflow-hidden rounded-[var(--r)] border border-[var(--line)] bg-[var(--line)] text-[13.5px]">
        <Row
          label={lang === "si" ? "ස්ථානය" : "Venue"}
          value={`${L(c.institute)} — ${L(c.town)}`}
        />
        <Row label={lang === "si" ? "දිනය" : "Day"} value={L(c.day)} />
        <Row
          label={lang === "si" ? "වේලාව" : "Time"}
          value={L(c.time)}
          mono
          warn={!c.verified}
        />
      </dl>

      {c.highlights.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {c.highlights.map((h) => (
            <li key={h.en} className="chip">
              {L(h)}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-7">
        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-full"
        >
          <WhatsAppGlyph className="h-[18px] w-[18px] shrink-0" />
          {c.verified ? t.classes.join : t.classes.confirm}
        </a>
      </div>
    </article>
  );
}

function Row({
  label,
  value,
  mono,
  warn,
}: {
  label: string;
  value: string;
  mono?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4 bg-[var(--surface)] px-4 py-3">
      <dt className="w-20 shrink-0 text-[12.5px] text-[var(--ink-3)]">{label}</dt>
      <dd
        className={`min-w-0 font-medium ${mono ? "num" : ""} ${
          warn ? "text-[var(--accent)]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
