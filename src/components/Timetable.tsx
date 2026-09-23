"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { joinLink } from "./Classes";
import { classes, isOL, type ClassInfo } from "@/lib/site";

/** Weekday columns, matched against each class's `day` field. */
const DAYS: { si: string; en: string; match: string[] }[] = [
  { si: "සඳුදා", en: "Monday", match: ["සඳුදා", "Monday"] },
  {
    si: "අඟහරුවාදා",
    en: "Tuesday",
    match: ["අඟහරුවාදා", "Tuesday"],
  },
  { si: "බදාදා", en: "Wednesday", match: ["බදාදා", "Wednesday"] },
  {
    si: "බ්‍රහස්පතින්දා",
    en: "Thursday",
    match: ["බ්‍රහස්පතින්දා", "Thursday"],
  },
  { si: "සිකුරාදා", en: "Friday", match: ["සිකුරාදා", "Friday"] },
  {
    si: "සෙනසුරාදා",
    en: "Saturday",
    match: ["සෙනසුරාදා", "Saturday", "සති අන්තයේ", "Weekend"],
  },
  {
    si: "ඉරිදා",
    en: "Sunday",
    match: ["ඉරිදා", "Sunday", "සති අන්තයේ", "Weekend"],
  },
];

type Level = "all" | "al" | "ol";

const noop = () => () => {};

/** Pixel height of one hour on the week grid. */
const HOUR = 54;

const slotted = classes.filter((c) => c.slot);
const GRID_FROM = Math.floor(Math.min(...slotted.map((c) => c.slot!.from)));
const GRID_TO = Math.ceil(Math.max(...slotted.map((c) => c.slot!.to)));

function classesOn(day: (typeof DAYS)[number], list: ClassInfo[]) {
  return list
    .filter((c) => c.slot && day.match.some((m) => c.day.si === m || c.day.en === m))
    .sort((a, b) => a.slot!.from - b.slot!.from);
}

/** Side-by-side lanes so overlapping classes on one day never cover each other. */
function lanes(list: ClassInfo[]) {
  const ends: number[] = [];
  const lane = new Map<string, number>();
  for (const c of list) {
    const i = ends.findIndex((end) => end <= c.slot!.from);
    const at = i === -1 ? ends.length : i;
    ends[at] = c.slot!.to;
    lane.set(c.id, at);
  }
  return { lane, count: Math.max(ends.length, 1) };
}

function hourLabel(h: number, lang: "si" | "en") {
  const twelve = h % 12 === 0 ? 12 : h % 12;
  if (lang === "si") return `${h < 12 ? "පෙ.ව." : "ප.ව."} ${twelve}`;
  return `${twelve} ${h < 12 ? "AM" : "PM"}`;
}

function gradeTag(c: ClassInfo) {
  if (c.grade === "all") return "ALL";
  if (c.grade === "ol") return "O/L";
  return `G${c.grade}`;
}

export function Timetable() {
  const { t, L, lang } = useLang();
  const [level, setLevel] = useState<Level>("all");
  // weekday index (Mon = 0); null on the server so its HTML never guesses the day
  const today = useSyncExternalStore(
    noop,
    () => (new Date().getDay() + 6) % 7,
    () => null,
  );

  const list = useMemo(
    () =>
      classes.filter((c) =>
        level === "all" ? true : level === "ol" ? isOL(c) : !isOL(c),
      ),
    [level],
  );

  // only classes with a confirmed slot sit on a day; the rest go in the "tbc" strip
  const week = DAYS.map((d, i) => ({
    day: d,
    i,
    list: classesOn(d, list),
  }));
  const freeDays = week.filter((w) => w.list.length === 0);
  const unconfirmed = list.filter((c) => !c.slot);

  const hours = list.reduce((sum, c) => sum + (c.slot ? c.slot.to - c.slot.from : 0), 0);
  const venues = new Set(
    list.filter((c) => c.mode !== "online").map((c) => `${c.institute.en}|${c.town.en}`),
  ).size;

  const filters: { key: Level; label: string; count: number }[] = [
    { key: "all", label: t.timetable.filterAll, count: classes.length },
    { key: "al", label: t.timetable.al, count: classes.filter((c) => !isOL(c)).length },
    { key: "ol", label: t.timetable.ol, count: classes.filter(isOL).length },
  ];

  const dayName = (d: (typeof DAYS)[number]) => (lang === "si" ? d.si : d.en);

  return (
    <section
      id="timetable"
      className="border-b-2 border-[var(--ink)] py-14 sm:py-20"
    >
      <div className="shell">
        <SectionHead
          no="03"
          eyebrow={t.timetable.eyebrow}
          title={t.timetable.title}
          sub={t.timetable.sub}
        />

        {/* level filter + weekly totals */}
        <Reveal className="mt-7 flex flex-col gap-4 sm:mt-8 md:flex-row md:items-stretch md:justify-between">
          <div
            role="group"
            aria-label={t.timetable.eyebrow}
            className="flex w-full border-2 border-[var(--ink)] bg-[var(--paper)] md:w-auto"
          >
            {filters.map((f, i) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setLevel(f.key)}
                aria-pressed={level === f.key}
                className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold transition-colors md:flex-none md:px-5 ${
                  i > 0 ? "border-l-2 border-[var(--ink)]" : ""
                } ${
                  level === f.key
                    ? "text-[var(--panel-fg)]"
                    : "hover:bg-[var(--mustard)] hover:text-[var(--on-accent)]"
                }`}
              >
                {level === f.key && (
                  <motion.span
                    layoutId="timetable-level"
                    className="absolute inset-0 bg-[var(--panel)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
                <span className="relative z-10 font-[family-name:var(--font-mono)] text-[11px] opacity-70">
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 border-2 border-[var(--ink)] bg-[var(--paper-2)]">
            <Stat k={t.timetable.statClasses} v={list.length} />
            <Stat k={t.timetable.statHours} v={hours} border />
            <Stat k={t.timetable.statVenues} v={venues} border />
          </div>
        </Reveal>

        <Legend />

        {/* phones + tablets: one block per day that actually has a class */}
        <ul className="mt-6 grid gap-4 lg:hidden">
          {week
            .filter((w) => w.list.length > 0)
            .map(({ day, i, list: dayList }) => (
              <Reveal as="li" key={day.en}>
                <div
                  className={`border-2 border-[var(--ink)] bg-[var(--paper-2)] ${
                    i === today ? "hard-sm" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 border-b-2 border-[var(--ink)] bg-[var(--panel)] px-4 py-2.5">
                    <p className="display text-[16px] text-[var(--mustard)]">{dayName(day)}</p>
                    <span className="flex items-center gap-2">
                      {i === today && <TodayTag />}
                      <span className="label text-[var(--panel-fg)] opacity-70">
                        {dayList.length}
                      </span>
                    </span>
                  </div>
                  <ul>
                    {dayList.map((c, j) => (
                      <li
                        key={c.id}
                        className={j > 0 ? "border-t-2 border-dashed border-[var(--ink)]" : ""}
                      >
                        <DayEntry c={c} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

          {freeDays.length > 0 && (
            <Reveal as="li">
              <p className="border-2 border-dashed border-[var(--ink)]/50 px-4 py-3 text-[13px] text-[var(--ink-soft)]">
                {t.timetable.noClass}: {freeDays.map((w) => dayName(w.day)).join(", ")}
              </p>
            </Reveal>
          )}
        </ul>

        {/* laptops and up: week-at-a-glance time grid */}
        <Reveal className="mt-6 hidden lg:block">
          <div className="hard border-2 border-[var(--ink)] bg-[var(--paper)]">
            <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b-2 border-[var(--ink)] bg-[var(--panel)] text-[var(--panel-fg)]">
              <span />
              {week.map(({ day, i, list: dayList }) => (
                <div
                  key={day.en}
                  className={`border-l-2 border-[var(--ink)] px-3 py-2.5 ${
                    i === today ? "bg-[var(--mustard)] text-[var(--on-accent)]" : ""
                  }`}
                >
                  <p className="text-[13.5px] font-bold leading-tight">{dayName(day)}</p>
                  <p className="label mt-0.5 opacity-70">
                    {i === today
                      ? t.timetable.today
                      : dayList.length
                        ? `${dayList.length} ×`
                        : "-"}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="relative grid grid-cols-[64px_repeat(7,minmax(0,1fr))]"
              style={{ height: (GRID_TO - GRID_FROM) * HOUR }}
            >
              {/* hour rules across the whole grid */}
              {Array.from({ length: GRID_TO - GRID_FROM }, (_, h) => (
                <div
                  key={h}
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[var(--ink)]/20"
                  style={{ top: h * HOUR }}
                >
                  <span className="absolute left-2 top-1 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--ink-soft)]">
                    {hourLabel(GRID_FROM + h, lang)}
                  </span>
                </div>
              ))}

              <span />
              {week.map(({ day, i, list: dayList }) => {
                const { lane, count } = lanes(dayList);
                return (
                  <div
                    key={day.en}
                    className={`relative border-l-2 border-[var(--ink)] ${
                      i === today ? "bg-[var(--mustard)]/10" : ""
                    }`}
                    style={
                      dayList.length === 0
                        ? {
                            backgroundImage:
                              "repeating-linear-gradient(135deg, var(--rule-line) 0 2px, transparent 2px 12px)",
                          }
                        : undefined
                    }
                  >
                    {dayList.map((c) => (
                      <GridBlock
                        key={c.id}
                        c={c}
                        top={(c.slot!.from - GRID_FROM) * HOUR}
                        height={(c.slot!.to - c.slot!.from) * HOUR}
                        lane={lane.get(c.id)!}
                        lanes={count}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* classes that cannot sit on the grid until their time is confirmed */}
        {unconfirmed.length > 0 && (
          <Reveal className="mt-6 lg:mt-8">
            <p className="label text-[var(--maroon)]">{t.timetable.tbc}</p>
            <ul className="mt-3 grid gap-3 lg:grid-cols-2 lg:gap-4">
              {unconfirmed.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-2 border-dashed border-[var(--ink)] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug">{L(c.title)}</p>
                    <p className="mt-0.5 text-[12.5px] text-[var(--ink-soft)]">
                      {L(c.day)} · {L(c.institute)} - {L(c.town)}
                    </p>
                  </div>
                  <a
                    href={joinLink(c, t, L)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 border-2 border-[var(--ink)] px-3 py-1.5 text-[12px] font-bold hover:bg-[var(--mustard)] hover:text-[var(--on-accent)]"
                  >
                    {t.classes.confirm} →
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Stat({ k, v, border }: { k: string; v: number; border?: boolean }) {
  return (
    <div className={`px-4 py-2 md:min-w-[120px] ${border ? "border-l-2 border-[var(--ink)]" : ""}`}>
      <p className="display text-[22px] leading-none">{v}</p>
      <p className="mt-1 text-[11.5px] leading-tight text-[var(--ink-soft)]">{k}</p>
    </div>
  );
}

function Legend() {
  const { t } = useLang();
  return (
    <Reveal className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]">
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-3.5 w-3.5 border-2 border-[var(--ink)] bg-[var(--panel)]" />
        {t.timetable.al}
      </span>
      <span className="flex items-center gap-2">
        <span aria-hidden className="h-3.5 w-3.5 border-2 border-[var(--ink)] bg-[var(--mustard)]" />
        {t.timetable.ol}
      </span>
      <span className="flex items-center gap-2 text-[var(--maroon)]">
        <span aria-hidden className="h-3.5 w-3.5 border-2 border-dashed border-[var(--maroon)]" />
        {t.timetable.tbc}
      </span>
    </Reveal>
  );
}

function TodayTag() {
  const { t } = useLang();
  return (
    <span className="label bg-[var(--mustard)] px-1.5 py-0.5 text-[var(--on-accent)]">
      {t.timetable.today}
    </span>
  );
}

function duration(c: ClassInfo, lang: "si" | "en", unit: string) {
  if (!c.slot) return null;
  const h = c.slot.to - c.slot.from;
  return lang === "si" ? `${unit} ${h}` : `${h} ${unit}`;
}

/** One class placed on the week grid; the whole block links to WhatsApp. */
function GridBlock({
  c,
  top,
  height,
  lane,
  lanes: count,
}: {
  c: ClassInfo;
  top: number;
  height: number;
  lane: number;
  lanes: number;
}) {
  const { t, L } = useLang();
  const ol = isOL(c);
  const roomy = height >= HOUR * 3;

  return (
    <motion.a
      href={joinLink(c, t, L)}
      target="_blank"
      rel="noopener noreferrer"
      title={`${L(c.title)} · ${L(c.time)}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.3, 1] }}
      className={`hard-sm absolute flex flex-col overflow-hidden border-2 border-[var(--ink)] px-2 py-1.5 ${
        ol
          ? "bg-[var(--mustard)] text-[var(--on-accent)]"
          : "bg-[var(--panel)] text-[var(--panel-fg)]"
      }`}
      style={{
        top: top + 3,
        height: height - 6,
        left: `calc(${(lane / count) * 100}% + 5px)`,
        width: `calc(${100 / count}% - 10px)`,
      }}
    >
      <span
        className={`font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-wider ${
          ol ? "" : "text-[var(--mustard)]"
        }`}
      >
        {ol ? "O/L" : "A/L"} · {gradeTag(c)}
      </span>
      <span className="mt-0.5 text-[12px] font-bold leading-tight">{L(c.kind)}</span>
      <span className="mt-0.5 truncate text-[11px] leading-tight opacity-80">
        {L(c.institute)} - {L(c.town)}
      </span>
      {roomy && (
        <span className="mt-1.5 text-[11px] leading-snug opacity-80">{L(c.title)}</span>
      )}
      <span className="mt-auto font-[family-name:var(--font-mono)] text-[10.5px] leading-tight">
        {L(c.time)}
      </span>
    </motion.a>
  );
}

function DayEntry({ c }: { c: ClassInfo }) {
  const { t, L, lang } = useLang();
  const ol = isOL(c);
  const dur = duration(c, lang, t.timetable.hours);

  return (
    <div
      className={`flex gap-3 border-l-[6px] px-4 py-4 ${
        ol ? "border-l-[var(--mustard)]" : "border-l-[var(--panel)]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <span
            className={`label px-1.5 py-0.5 ${
              ol
                ? "bg-[var(--mustard)] text-[var(--on-accent)]"
                : "bg-[var(--panel)] text-[var(--panel-fg)]"
            }`}
          >
            {ol ? "O/L" : "A/L"} · {gradeTag(c)}
          </span>
          <span className="label text-[var(--maroon)]">{L(c.kind)}</span>
        </p>
        <p className="mt-1.5 text-[14.5px] font-bold leading-snug">{L(c.title)}</p>
        <dl className="mt-2 grid gap-1 text-[13px]">
          <div className="flex gap-2">
            <dt className="shrink-0 text-[var(--ink-soft)]">▣</dt>
            <dd>
              {L(c.institute)} - {L(c.town)}
            </dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="shrink-0 text-[var(--ink-soft)]">◷</dt>
            <dd
              className={`font-[family-name:var(--font-mono)] ${
                c.verified ? "" : "text-[var(--maroon)]"
              }`}
            >
              {L(c.time)}
            </dd>
            {dur && (
              <dd className="font-[family-name:var(--font-mono)] text-[var(--ink-soft)]">
                ({dur})
              </dd>
            )}
          </div>
        </dl>
        <a
          href={joinLink(c, t, L)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[12.5px] font-bold text-[var(--green)] underline underline-offset-4"
        >
          {c.verified ? t.timetable.join : t.classes.confirm} →
        </a>
      </div>
    </div>
  );
}
