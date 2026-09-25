"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import { MINUTES_PER_DAY, useWeekMinute } from "./useWeekMinute";
import {
  batches,
  classes,
  clockLabel,
  days,
  waLink,
  type BatchId,
  type ClassInfo,
} from "@/lib/site";

type Filter = BatchId | "all";

/** Calendar window: the earliest start and latest finish, to the hour. */
const FIRST_HOUR = Math.floor(Math.min(...classes.map((c) => c.start)) / 60);
const LAST_HOUR = Math.ceil(Math.max(...classes.map((c) => c.end)) / 60);
const HOUR_PX = 52;
const GRID_PX = (LAST_HOUR - FIRST_HOUR) * HOUR_PX;
const toPx = (minutes: number) => ((minutes - FIRST_HOUR * 60) / 60) * HOUR_PX;

const weekStart = (c: ClassInfo) => c.dayIndex * MINUTES_PER_DAY + c.start;
const weekEnd = (c: ClassInfo) => c.dayIndex * MINUTES_PER_DAY + c.end;
const byWeek = [...classes].sort((a, b) => weekStart(a) - weekStart(b));
const freeDays = days.filter((_, i) => !classes.some((c) => c.dayIndex === i));

const batchColor = (c: ClassInfo) => `var(--batch-${c.batch.id})`;
const tint = (c: ClassInfo, pct = 14) =>
  `color-mix(in srgb, ${batchColor(c)} ${pct}%, var(--surface))`;

/** The class running now, or the next one to start (wrapping to next week). */
function upcoming(list: ClassInfo[], now: number | null) {
  if (now === null || list.length === 0) return null;
  const live = list.find((c) => weekStart(c) <= now && now < weekEnd(c));
  if (live) return { c: live, live: true };
  return { c: list.find((c) => weekStart(c) > now) ?? list[0], live: false };
}

function useMessage() {
  const { t, L } = useLang();
  return (c: ClassInfo) =>
    waLink(
      `${t.wa.classPrefix}\n\n• ${L(c.title)}\n• ${L(c.institute)}, ${L(c.town)}\n• ${L(
        c.day,
      )} ${L(c.time)}`,
    );
}

/** "9.00 - 11.30 a.m." — the meridiem is printed once when both ends share it. */
function shortRange(c: ClassInfo, lang: "si" | "en") {
  const a = clockLabel(c.start)[lang];
  const b = clockLabel(c.end)[lang];
  if (c.start < 720 !== c.end < 720) return `${a} - ${b}`;
  return lang === "si"
    ? `${a} - ${b.replace(/^\S+ /, "")}`
    : `${a.replace(/ [ap]\.m\.$/, "")} - ${b}`;
}

function duration(c: ClassInfo, lang: "si" | "en") {
  const h = (c.end - c.start) / 60;
  return lang === "si" ? `පැය ${h}` : `${h} h`;
}

export function Timetable() {
  const { t, L, lang } = useLang();
  const now = useWeekMinute();
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(
    () =>
      filter === "all" ? byWeek : byWeek.filter((c) => c.batch.id === filter),
    [filter],
  );
  const next = upcoming(shown, now);

  return (
    <section
      id="timetable"
      className="py-16 sm:py-24"
    >
      <div className="shell">
        <SectionHead
          no="03"
          eyebrow={t.timetable.eyebrow}
          title={t.timetable.title}
          sub={t.timetable.sub}
        />

        {/* batch legend doubles as the filter */}
        <Reveal className="mt-7 sm:mt-8">
          <div
            role="group"
            aria-label={t.timetable.filterLabel}
            className="flex flex-wrap gap-2"
          >
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={t.timetable.allBatches}
            />
            {batches.map((b) => (
              <FilterChip
                key={b.id}
                active={filter === b.id}
                onClick={() => setFilter(filter === b.id ? "all" : b.id)}
                label={L(b.name)}
                color={`var(--batch-${b.id})`}
              />
            ))}
          </div>
        </Reveal>

        <NextUp next={next} />

        <div className="lg:hidden">
          <MobileSchedule shown={shown} now={now} />
        </div>

        <Reveal className="mt-6 hidden lg:block">
          <WeekCalendar highlight={filter} now={now} />
        </Reveal>

        <p className="mt-4 text-[13px] text-[var(--muted)]">
          {freeDays.length > 0 &&
            (lang === "si"
              ? `${freeDays.map((d) => d.long.si).join(", ")} දිනට පන්ති නැත. `
              : `No classes on ${freeDays.map((d) => d.long.en).join(", ")}. `)}
          <span className="hidden lg:inline">{t.timetable.tapHint}</span>
        </p>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
        active
          ? "border-transparent bg-[var(--fg)] text-[var(--bg)] shadow-[var(--shadow)]"
          : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)]"
      }`}
    >
      {color && (
        <span
          aria-hidden
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: color }}
        />
      )}
      {label}
    </button>
  );
}

/** "On now" / "Next class" strip. Height is reserved so the page never jumps. */
function NextUp({ next }: { next: { c: ClassInfo; live: boolean } | null }) {
  const { t, L } = useLang();
  const message = useMessage();

  return (
    <div className="mt-4 min-h-[58px]" aria-live="polite">
      {next && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          key={next.c.id}
          className="grid gap-2 rounded-2xl border border-[var(--line)] px-4 py-3 shadow-[var(--shadow-sm)] sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 sm:rounded-full sm:py-2 sm:pl-5 sm:pr-2"
          style={{ background: tint(next.c, 12) }}
        >
          <span className="label inline-flex items-center gap-2 text-[var(--brand)]">
            {next.live && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
              </span>
            )}
            {next.live ? t.timetable.now : t.timetable.next}
          </span>
          <span className="min-w-0 text-[13.5px] leading-snug sm:flex-1">
            <b>{L(next.c.title)}</b>
            <span className="text-[var(--muted)]">
              {" "}
              · {L(next.c.day)} · {L(next.c.time)} · {L(next.c.institute)},{" "}
              {L(next.c.town)}
            </span>
          </span>
          <a
            href={message(next.c)}
            target="_blank"
            rel="noopener noreferrer"
            className="press btn-green inline-flex items-center justify-self-start gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold"
          >
            <WhatsAppGlyph className="h-3.5 w-3.5 shrink-0" />
            {t.timetable.join}
          </a>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop: week calendar                                              */
/* ------------------------------------------------------------------ */

function WeekCalendar({
  highlight,
  now,
}: {
  highlight: Filter;
  now: number | null;
}) {
  const { t, L, lang } = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const today = now === null ? null : Math.floor(now / MINUTES_PER_DAY);
  const nowInDay = now === null ? null : now % MINUTES_PER_DAY;

  // close the details card on Escape or a click anywhere else
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest("[data-event]")) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hours = Array.from(
    { length: LAST_HOUR - FIRST_HOUR + 1 },
    (_, i) => FIRST_HOUR + i,
  );

  return (
    <div className="card rounded-3xl shadow-[var(--shadow)]">
      {/* day header */}
      <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] rounded-t-3xl border-b border-[var(--line)] bg-[var(--bg-soft)]">
        <span aria-hidden />
        {days.map((d, i) => {
          const count = classes.filter((c) => c.dayIndex === i).length;
          const isToday = i === today;
          return (
            <div
              key={d.long.en}
              className={`border-l border-[var(--line)] px-3 py-3 ${
                isToday ? "bg-[color-mix(in_srgb,var(--brand)_10%,transparent)]" : ""
              } ${i === 6 ? "rounded-tr-3xl" : ""}`}
            >
              <p className={`display text-[15px] leading-tight ${isToday ? "text-[var(--brand)]" : ""}`}>
                {L(d.long)}
              </p>
              <p className="mt-0.5 text-[11.5px] font-medium text-[var(--muted)]">
                {isToday
                  ? t.timetable.today
                  : count === 0
                    ? t.timetable.noClass
                    : lang === "si"
                      ? `පන්ති ${count}`
                      : `${count} ${count === 1 ? "class" : "classes"}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* body */}
      <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
        {/* hour gutter */}
        <div aria-hidden className="relative" style={{ height: GRID_PX }}>
          {hours.map((h) => (
            <span
              key={h}
              className={`absolute right-2 whitespace-nowrap font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--muted)] ${
                h === FIRST_HOUR ? "translate-y-1" : "-translate-y-1/2"
              }`}
              style={{ top: (h - FIRST_HOUR) * HOUR_PX }}
            >
              {h === LAST_HOUR ? "" : L(clockLabel(h * 60)).replace(".00", "")}
            </span>
          ))}
        </div>

        {days.map((d, i) => {
          const list = classes.filter((c) => c.dayIndex === i);
          const isToday = i === today;
          return (
            <div
              key={d.long.en}
              role="group"
              aria-label={L(d.long)}
              className={`relative border-l border-[var(--line)] ${i === 6 ? "rounded-br-3xl" : ""}`}
              style={{
                height: GRID_PX,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
                  HOUR_PX - 1
                }px, var(--rule-line) ${HOUR_PX - 1}px, var(--rule-line) ${HOUR_PX}px)`,
                backgroundColor: isToday
                  ? "color-mix(in srgb, var(--brand) 5%, var(--surface))"
                  : list.length === 0
                    ? "color-mix(in srgb, var(--bg-soft) 60%, var(--surface))"
                    : undefined,
              }}
            >
              {list.length === 0 && (
                <p className="label absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-90 text-center text-[var(--muted)] opacity-60">
                  {t.timetable.noClass}
                </p>
              )}

              {list.map((c) => (
                <CalendarEvent
                  key={c.id}
                  c={c}
                  dim={highlight !== "all" && highlight !== c.batch.id}
                  open={open === c.id}
                  onToggle={() => setOpen(open === c.id ? null : c.id)}
                  live={
                    isToday &&
                    nowInDay !== null &&
                    c.start <= nowInDay &&
                    nowInDay < c.end
                  }
                />
              ))}

              {isToday &&
                nowInDay !== null &&
                nowInDay >= FIRST_HOUR * 60 &&
                nowInDay <= LAST_HOUR * 60 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 z-20 h-0.5 bg-[image:var(--grad)]"
                    style={{ top: toPx(nowInDay) }}
                  >
                    <span className="absolute -left-1.5 -top-[5px] h-3 w-3 rounded-full bg-[var(--brand)]" />
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarEvent({
  c,
  dim,
  open,
  onToggle,
  live,
}: {
  c: ClassInfo;
  dim: boolean;
  open: boolean;
  onToggle: () => void;
  live: boolean;
}) {
  const { t, L, lang } = useLang();
  const message = useMessage();
  const panelId = useId();
  const top = toPx(c.start);
  const height = toPx(c.end) - top;
  // late classes open their card upwards; weekend columns open it leftwards
  const upwards = top > GRID_PX / 2;
  const leftwards = c.dayIndex >= 4;

  return (
    <div
      data-event
      className={`absolute inset-x-1 transition-opacity duration-300 ${
        open ? "z-30" : "z-10"
      } ${dim ? "opacity-25 hover:opacity-70" : ""}`}
      style={{ top: top + 2, height: height - 4 }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`group flex h-full w-full flex-col overflow-hidden rounded-xl border border-l-4 border-[var(--line)] px-2 py-1.5 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] ${
          open ? "-translate-y-0.5 shadow-[var(--shadow)]" : ""
        }`}
        style={{ background: tint(c), borderLeftColor: batchColor(c) }}
      >
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] leading-tight text-[var(--muted)]">
          {shortRange(c, lang)}
        </span>
        <span className="mt-0.5 text-[13px] font-bold leading-tight">
          {L(c.batch.name)}
        </span>
        {c.label && (
          <span
            className="text-[11.5px] font-semibold leading-tight"
            style={{ color: batchColor(c) }}
          >
            {L(c.label)}
          </span>
        )}
        <span className="mt-auto truncate text-[11.5px] leading-tight text-[var(--muted)]">
          ▣ {L(c.town)}
        </span>
        {live && (
          <span className="label absolute right-1.5 top-1.5 rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[9px] text-[var(--on-brand)]">
            {t.timetable.now}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label={L(c.title)}
            initial={{ opacity: 0, scale: 0.96, x: leftwards ? 8 : -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.3, 1] }}
            className="absolute w-[280px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-lg)]"
            style={{
              [upwards ? "bottom" : "top"]: 0,
              [leftwards ? "right" : "left"]: "calc(100% + 10px)",
            }}
          >
            <div
              className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-4 py-2.5"
              style={{ background: tint(c, 14) }}
            >
              <span className="label" style={{ color: batchColor(c) }}>
                {L(c.batch.kind)}
              </span>
              <button
                type="button"
                onClick={onToggle}
                aria-label={t.timetable.close}
                className="grid h-6 w-6 place-items-center rounded-full text-[11px] text-[var(--muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <div className="px-4 py-3.5">
              <p className="display text-[17px] leading-tight">{L(c.title)}</p>
              <dl className="mt-2.5 grid gap-1.5 text-[13px]">
                <DetailRow k="▤" v={L(c.day)} />
                <DetailRow
                  k="◷"
                  v={`${L(c.time)} (${duration(c, lang)})`}
                  mono
                />
                <DetailRow k="▣" v={`${L(c.institute)}, ${L(c.town)}`} />
              </dl>
              <a
                href={message(c)}
                target="_blank"
                rel="noopener noreferrer"
                className="press btn-green mt-3.5 flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-semibold"
              >
                <WhatsAppGlyph className="h-4 w-4 shrink-0" />
                {t.timetable.join}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt aria-hidden className="w-4 shrink-0 text-[var(--brand)]">
        {k}
      </dt>
      <dd
        className={
          mono ? "font-[family-name:var(--font-mono)] text-[12.5px]" : ""
        }
      >
        {v}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Phones + tablets: day picker with an agenda, or the whole week      */
/* ------------------------------------------------------------------ */

function MobileSchedule({
  shown,
  now,
}: {
  shown: ClassInfo[];
  now: number | null;
}) {
  const { t, L, lang } = useLang();
  const reduce = useReducedMotion();
  const today = now === null ? null : Math.floor(now / MINUTES_PER_DAY);
  const [view, setView] = useState<"day" | "week">("day");
  const [picked, setPicked] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const day = picked ?? today ?? 0;

  const go = (to: number) => {
    const wrapped = (to + 7) % 7;
    setDir(to > day ? 1 : -1);
    setPicked(wrapped);
  };

  const list = shown.filter((c) => c.dayIndex === day);
  const after = upcoming(shown, (day + 1) * MINUTES_PER_DAY - 1);

  return (
    <div className="mt-5">
      {/* view switch */}
      <div
        className="flex rounded-full border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[var(--shadow-sm)]"
        role="tablist"
      >
        {(["day", "week"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`flex-1 rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              view === v ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--muted)]"
            }`}
          >
            {v === "day" ? t.timetable.dayView : t.timetable.weekView}
          </button>
        ))}
      </div>

      {view === "day" ? (
        <>
          {/* day strip */}
          <div
            className="mt-4 grid grid-cols-7 gap-1.5"
            role="tablist"
            aria-label={t.timetable.title}
          >
            {days.map((d, i) => {
              const dots = shown.filter((c) => c.dayIndex === i);
              const active = i === day;
              return (
                <button
                  key={d.long.en}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={L(d.long)}
                  onClick={() => go(i)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-2xl border px-0.5 pb-2 pt-2.5 transition-colors ${
                    active
                      ? "border-transparent bg-[image:var(--grad)] text-[var(--on-brand)] shadow-[var(--glow)]"
                      : dots.length === 0
                        ? "border-[var(--line)] bg-transparent text-[var(--muted)]"
                        : "border-[var(--line)] bg-[var(--surface)]"
                  }`}
                >
                  <span className="text-[12.5px] font-bold leading-none">
                    {L(d.short)}
                  </span>
                  <span className="flex h-2 items-center gap-0.5">
                    {dots.map((c) => (
                      <span
                        key={c.id}
                        className={`h-1.5 w-1.5 rounded-full ${active ? "ring-1 ring-white/70" : ""}`}
                        style={{ background: batchColor(c) }}
                      />
                    ))}
                  </span>
                  {i === today && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-1.5 text-[8.5px] font-bold uppercase leading-[14px] tracking-wide text-[var(--on-accent)]">
                      {t.timetable.today}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* selected day */}
          <div className="card mt-4 overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-soft)]">
              <button
                type="button"
                onClick={() => go(day - 1)}
                aria-label={t.timetable.prevDay}
                className="m-1.5 grid h-9 w-9 place-items-center rounded-full text-[18px] leading-none hover:bg-[var(--surface)]"
              >
                ‹
              </button>
              <p className="display text-[17px]">
                {L(days[day].long)}
                {day === today && (
                  <span className="label ml-2 text-[var(--brand)]">
                    · {t.timetable.today}
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => go(day + 1)}
                aria-label={t.timetable.nextDay}
                className="m-1.5 grid h-9 w-9 place-items-center rounded-full text-[18px] leading-none hover:bg-[var(--surface)]"
              >
                ›
              </button>
            </div>

            {/* swipe layer stays put; the day inside it slides in and out */}
            <motion.div
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(day + 1);
                else if (info.offset.x > 60) go(day - 1);
              }}
              className="touch-pan-y"
            >
              <motion.div
                key={day}
                initial={
                  reduce || picked === null
                    ? false
                    : { opacity: 0, x: dir * 28 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.3, 1] }}
              >
                {list.length > 0 ? (
                  <ul>
                    {list.map((c, i) => (
                      <li
                        key={c.id}
                        className={
                          i > 0
                            ? "border-t border-[var(--line)]"
                            : ""
                        }
                      >
                        <AgendaItem
                          c={c}
                          live={
                            now !== null &&
                            weekStart(c) <= now &&
                            now < weekEnd(c)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="display text-[18px]">
                      {lang === "si"
                        ? `${L(days[day].long)} දිනට පන්ති නැත`
                        : `No classes on ${L(days[day].long)}`}
                    </p>
                    {after && (
                      <button
                        type="button"
                        onClick={() =>
                          go(
                            after.c.dayIndex > day
                              ? after.c.dayIndex
                              : after.c.dayIndex + 7,
                          )
                        }
                        className="press btn-ghost mt-4 rounded-full px-4 py-2 text-[13px] font-semibold"
                      >
                        {t.timetable.next}: {L(after.c.day)} ·{" "}
                        {L(clockLabel(after.c.start))} →
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
          <p className="label mt-2 text-center text-[var(--muted)] opacity-70">
            {t.timetable.swipe}
          </p>
        </>
      ) : (
        <ul className="mt-4 grid gap-4">
          {days.map((d, i) => {
            const dayList = shown.filter((c) => c.dayIndex === i);
            if (dayList.length === 0) return null;
            return (
              <li
                key={d.long.en}
                className="card overflow-hidden rounded-3xl"
              >
                <p className="display flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-[16px]">
                  {L(d.long)}
                  {i === today && (
                    <span className="label text-[var(--brand)]">
                      {t.timetable.today}
                    </span>
                  )}
                </p>
                <ul>
                  {dayList.map((c, j) => (
                    <li
                      key={c.id}
                      className={
                        j > 0
                          ? "border-t border-[var(--line)]"
                          : ""
                      }
                    >
                      <AgendaItem
                        c={c}
                        live={
                          now !== null &&
                          weekStart(c) <= now &&
                          now < weekEnd(c)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function AgendaItem({ c, live }: { c: ClassInfo; live: boolean }) {
  const { t, L, lang } = useLang();
  const message = useMessage();
  return (
    <div className="flex gap-3 px-4 py-4">
      <div className="w-[80px] shrink-0 whitespace-nowrap font-[family-name:var(--font-mono)] text-[12px] leading-snug">
        <p className="font-bold">{L(clockLabel(c.start))}</p>
        <p className="text-[var(--muted)]">{L(clockLabel(c.end))}</p>
        <p className="mt-1 text-[10.5px] text-[var(--muted)]">
          {duration(c, lang)}
        </p>
      </div>
      <div
        className="min-w-0 flex-1 border-l-[3px] pl-3"
        style={{ borderLeftColor: batchColor(c) }}
      >
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[15px] font-bold leading-tight">
            {L(c.batch.name)}
          </span>
          {c.label && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: tint(c, 16), color: batchColor(c) }}
            >
              {L(c.label)}
            </span>
          )}
          {live && (
            <span className="label rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[9.5px] text-[var(--on-brand)]">
              {t.timetable.now}
            </span>
          )}
        </p>
        <p className="label mt-1 text-[var(--muted)]">{L(c.batch.kind)}</p>
        <p className="mt-1.5 text-[13px] leading-snug">
          <span aria-hidden className="mr-1.5 text-[var(--brand)]">
            ▣
          </span>
          {L(c.institute)}, {L(c.town)}
        </p>
        <a
          href={message(c)}
          target="_blank"
          rel="noopener noreferrer"
          className="press btn-green mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold"
        >
          <WhatsAppGlyph className="h-3.5 w-3.5 shrink-0" />
          {t.timetable.join}
        </a>
      </div>
    </div>
  );
}
