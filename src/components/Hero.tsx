"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useLang } from "./LanguageProvider";
import { StatCounter } from "./StatCounter";
import { batches, sessionsOf, site, stats, tutorPhoto, waLink } from "@/lib/site";

/** Page-load choreography for the headline column. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.2, 0.8, 0.3, 1] } },
};

const BADGE_KEY = "nextgen-ict:hero-badge-dismissed";
const badgeListeners = new Set<() => void>();

function subscribeBadge(cb: () => void) {
  badgeListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    badgeListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function badgeDismissed() {
  try {
    return localStorage.getItem(BADGE_KEY) === "1";
  } catch {
    return false;
  }
}

function dismissBadge() {
  try {
    localStorage.setItem(BADGE_KEY, "1");
  } catch {
    /* storage blocked - banner just hides for this visit */
  }
  badgeListeners.forEach((cb) => cb());
}

const wideQuery = "(min-width: 1024px)";
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function Hero() {
  const { t, L } = useLang();
  const reduce = useReducedMotion();
  // server snapshot = dismissed, so returning visitors never see a flash
  const badgeHidden = useSyncExternalStore(subscribeBadge, badgeDismissed, () => true);

  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(wideQuery).matches,
    () => false,
  );

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // gentle parallax on laptops only - stacked, the portrait would drift over the copy below it
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce || !wide ? 0 : 60]);

  return (
    <section id="home" ref={sectionRef} className="relative isolate -mt-[68px] overflow-hidden pt-[68px] sm:-mt-[76px] sm:pt-[76px]">
      {/* backdrop: a faint grid, faded at the edges */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
      </div>

      <div className="shell pb-14 pt-10 sm:pb-16 sm:pt-16">
        {/* phones/tablets: headline > portrait > rest, centred. laptops: text column left, portrait right. */}
        <div className="grid items-start gap-10 text-center sm:gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-12 lg:gap-y-0 lg:text-left">
          {/* 1. headline - the message comes first */}
          <motion.div
            className="lg:col-start-1 lg:row-start-1"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            {!badgeHidden && (
              <motion.div
                variants={item}
                className="glass mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--line)] py-1 pl-3 pr-1 shadow-[var(--shadow-sm)] sm:mb-7"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
                </span>
                <p className="min-w-0 text-left text-[12.5px] font-medium leading-snug sm:text-[13px]">
                  {t.hero.badge}
                </p>
                <button
                  type="button"
                  onClick={dismissBadge}
                  aria-label={t.hero.badgeClose}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] text-[var(--muted)] transition-colors hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]"
                >
                  <span aria-hidden>✕</span>
                </button>
              </motion.div>
            )}

            <h1 className="display">
              <motion.span
                variants={item}
                className="flex items-center justify-center gap-3 text-[clamp(1.4rem,4.8vw,2.3rem)] font-extrabold leading-tight lg:justify-start"
              >
                <span aria-hidden className="h-[0.18em] w-[1.4em] shrink-0 rounded-full bg-[var(--brand)]" />
                {t.hero.titleTop}
              </motion.span>
              <motion.span
                variants={item}
                className="block pb-2 text-[var(--brand)] text-[clamp(6rem,27vw,11rem)] font-extrabold leading-[0.9] tracking-[-0.06em]"
              >
                {t.hero.titleMain}
              </motion.span>
              <motion.span
                variants={item}
                className="block text-[clamp(1.5rem,5.4vw,2.6rem)] font-extrabold leading-tight"
              >
                {t.hero.titleBottom}
              </motion.span>
            </h1>
          </motion.div>

          {/* 2. portrait - under the headline on small screens, beside the copy on laptops */}
          <motion.div
            style={{ y: portraitY }}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.3, ease: [0.2, 0.8, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[min(320px,76vw)] sm:max-w-[360px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[480px]"
          >
            <div className="relative aspect-[4/5]">
              {/* soft, slowly morphing tinted shape behind the cut-out */}
              <div aria-hidden className="absolute inset-x-[10%] bottom-[8%] top-[18%]">
                <div className="hero-blob absolute inset-[6%] border border-[var(--line)] bg-[color-mix(in_srgb,var(--brand)_9%,var(--bg-soft))]" />
              </div>

              {/* two orbits of tech tokens circling the portrait */}
              <Orbit radius={50} seconds={46} tokens={OUTER_TOKENS} reduce={!!reduce} />
              <Orbit radius={36} seconds={34} tokens={INNER_TOKENS} reduce={!!reduce} reverse />

              {tutorPhoto ? (
                <motion.div
                  className="absolute inset-0"
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                >
                  <Image
                    src={tutorPhoto}
                    alt={`${L(site.tutor.name)} — ${L(site.tutor.role)}, ${L(site.location)}`}
                    fill
                    priority
                    className="object-contain object-bottom"
                    sizes="(max-width: 1024px) 80vw, 480px"
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <TeacherGlyph className="h-32 w-32 text-white opacity-60 sm:h-48 sm:w-48" />
                  <p className="label absolute bottom-4 px-3 text-center text-white/80">
                    public/images/tutor.jpg
                  </p>
                </div>
              )}

              {/* floating chip */}
              <motion.div
                initial={reduce ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: [0.2, 0.8, 0.3, 1] }}
                className="glass absolute right-[-4%] top-[22%] hidden items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-2 text-left shadow-[var(--shadow)] sm:flex"
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--bg-soft)] text-[var(--brand)] text-[15px]">
                  ✓
                </span>
                <span className="leading-tight">
                  <span className="block text-[12.5px] font-bold">A/L · O/L</span>
                  <span className="block text-[11px] text-[var(--muted)]">{L(site.medium)}</span>
                </span>
              </motion.div>
            </div>

            {/* name plate, pinned over the foot of the photo */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.2, 0.8, 0.3, 1] }}
              className="glass relative z-10 mx-auto -mt-12 flex w-[90%] items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 text-left shadow-[var(--shadow-lg)] sm:-mt-14 sm:px-5 sm:py-3.5"
            >
              <span aria-hidden className="h-10 w-1 shrink-0 rounded-full bg-[var(--brand)]" />
              <span className="min-w-0">
                <span className="display block text-[18px] leading-tight sm:text-[20px]">
                  {L(site.tutor.name)}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--muted)] sm:text-[13px]">
                  {L(site.tutor.subject)}
                </span>
              </span>
            </motion.div>
          </motion.div>

          {/* 3. everything else: pitch, calls to action, confirmed classes */}
          <motion.div
            className="w-full lg:col-start-1 lg:row-start-2 lg:mt-7"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.p
              variants={item}
              className="mx-auto max-w-[56ch] text-[15px] leading-relaxed text-[var(--muted)] sm:text-[16.5px] lg:mx-0"
            >
              {t.hero.sub}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
            >
              <a
                href={waLink(t.wa.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="press btn-wa-soft inline-flex items-center justify-center gap-2.5 rounded-full py-3 pl-3.5 pr-6 text-[14.5px] font-semibold sm:text-[15px]"
              >
                <WhatsAppLogo className="h-7 w-7 shrink-0" />
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#timetable"
                className="press btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-semibold sm:text-[15px]"
              >
                {t.hero.ctaSecondary}
                <motion.span
                  aria-hidden
                  animate={reduce ? {} : { y: [0, 3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↓
                </motion.span>
              </a>
            </motion.div>

            {/* one glass card per batch, with its class days */}
            <motion.ul
              variants={item}
              className="mx-auto mt-8 grid max-w-3xl gap-3 sm:mt-9 sm:grid-cols-2 lg:mx-0 lg:max-w-none"
            >
              {batches.map((b) => {
                const list = sessionsOf(b.id);
                const days = [...new Set(list.map((c) => L(c.day)))];
                const towns = [...new Set(list.map((c) => L(c.town)))];
                return (
                  <li
                    key={b.id}
                    className="glass press flex items-start gap-3 rounded-2xl border border-[var(--line)] p-3.5 text-left shadow-[var(--shadow-sm)]"
                  >
                    <span
                      aria-hidden
                      className="mt-1 h-8 w-1 shrink-0 rounded-full"
                      style={{ background: `var(--batch-${b.id})` }}
                    />
                    <span className="min-w-0">
                      <span className="block text-[12px] font-semibold" style={{ color: `var(--batch-${b.id})` }}>
                        {L(b.name)} · {L(b.kind)}
                      </span>
                      <span className="mt-0.5 block text-[14px] font-semibold leading-snug">
                        {towns.join(", ")}
                      </span>
                      <span className="block text-[12.5px] text-[var(--muted)]">
                        {days.join(" · ")}
                      </span>
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>
      </div>

      {/* stats: the one solid maroon band on the page */}
      <div className="shell">
        <div className="stat-band relative overflow-hidden rounded-3xl text-white shadow-[var(--shadow-lg)]">
          <div aria-hidden className="stat-texture pointer-events-none absolute inset-0" />
          <dl className="relative grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.value}
                className={`relative flex flex-col items-center px-3 py-6 text-center sm:py-8 ${
                  i % 2 === 1 ? "border-l border-white/15" : ""
                } ${i >= 2 ? "border-t border-white/15 sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
              >
                <span
                  aria-hidden
                  className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 sm:h-11 sm:w-11"
                >
                  <StatIcon index={i} />
                </span>
                <dt className="display text-[clamp(1.9rem,6vw,2.9rem)]">
                  <StatCounter value={s.value} />
                </dt>
                <dd className="mt-1 text-[12.5px] font-medium leading-snug text-white/75 sm:text-[13.5px]">
                  {L(s.label)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* topic ticker */}
      <div className="marquee-mask mt-10 overflow-hidden py-2 sm:mt-12">
        <div className="marquee-track gap-3">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-3 pr-3"
              aria-hidden={dup === 1}
            >
              {[
                "Python",
                "Database",
                "Logic Gates",
                "Networking",
                "Web Development",
                "System Analysis",
                "Past Papers",
                "Revision",
                "A/L 2027",
                "A/L 2028",
                "O/L",
              ].map((w) => (
                <span
                  key={w}
                  className="whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[13px] font-medium text-[var(--muted)]"
                >
                  <span className="mr-2 text-[var(--brand)]">✦</span>
                  {w}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Line icons for the stat band, in the same order as `stats`. */
const STAT_ICONS = [
  // students
  "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.15a3.5 3.5 0 0 1 0 6.7",
  // experience
  "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM8.5 13.9 7 21l5-3 5 3-1.5-7.1",
  // locations
  "M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  // syllabus
  "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 0 6.5 23H20M9 10l2 2 4-4",
];

function StatIcon({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={STAT_ICONS[index % STAT_ICONS.length]} />
    </svg>
  );
}

type Token = { label: string; angle: number; color: string };

const OUTER_TOKENS: Token[] = [
  { label: "</>", angle: 200, color: "var(--muted)" },
  { label: "Py", angle: 320, color: "var(--muted)" },
  { label: "SQL", angle: 80, color: "var(--muted)" },
];

const INNER_TOKENS: Token[] = [
  { label: "{ }", angle: 20, color: "var(--muted)" },
];

/**
 * A dashed ring centred on the portrait that turns slowly; each token rides
 * the ring but counter-turns so its label always reads upright.
 */
function Orbit({
  radius,
  seconds,
  tokens,
  reduce,
  reverse = false,
}: {
  radius: number;
  seconds: number;
  tokens: Token[];
  reduce: boolean;
  reverse?: boolean;
}) {
  const turn = reverse ? -360 : 360;
  const spin = reduce
    ? {}
    : { animate: { rotate: turn }, transition: { duration: seconds, repeat: Infinity, ease: "linear" as const } };
  const counter = reduce
    ? {}
    : { animate: { rotate: -turn }, transition: { duration: seconds, repeat: Infinity, ease: "linear" as const } };

  return (
    <motion.div
      aria-hidden
      {...spin}
      className="absolute left-1/2 top-[46%] aspect-square rounded-full border border-dashed border-[var(--line-strong)]"
      style={{ width: `${radius * 2}%`, x: "-50%", y: "-50%" }}
    >
      {tokens.map((tk) => {
        const rad = (tk.angle * Math.PI) / 180;
        return (
          <span
            key={tk.label}
            className="absolute"
            style={{
              left: `${50 + 50 * Math.cos(rad)}%`,
              top: `${50 + 50 * Math.sin(rad)}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.span
              {...counter}
              className="glass grid h-9 min-w-9 place-items-center rounded-full border border-[var(--line)] px-2 font-[family-name:var(--font-mono)] text-[11px] font-bold shadow-[var(--shadow)] sm:h-11 sm:min-w-11 sm:text-[12.5px]"
              style={{ color: tk.color }}
            >
              {tk.label}
            </motion.span>
          </span>
        );
      })}
    </motion.div>
  );
}

export function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.35-1.4a9.82 9.82 0 0 0 4.69 1.2h.01c5.43 0 9.85-4.42 9.85-9.86A9.79 9.79 0 0 0 12.04 2Zm0 17.96h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.13 8.13 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.2 8.2Z" />
    </svg>
  );
}

/** Full-colour WhatsApp mark: solid green bubble, white handset. */
export function WhatsAppLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#25D366"
        d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.35-1.4a9.82 9.82 0 0 0 4.69 1.2h.01c5.43 0 9.85-4.42 9.85-9.86A9.79 9.79 0 0 0 12.04 2Z"
      />
      <path
        fill="#fff"
        d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

function TeacherGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      className={className}
      aria-hidden
    >
      <circle cx="64" cy="42" r="20" />
      <path d="M26 112c0-21 17-34 38-34s38 13 38 34" strokeLinecap="round" />
      <rect x="18" y="16" width="30" height="22" rx="2" opacity="0.5" />
      <path d="M80 20h30v22H92l-8 8v-8h-4z" opacity="0.5" />
    </svg>
  );
}
