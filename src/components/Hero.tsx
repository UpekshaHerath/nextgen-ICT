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
    <section id="home" ref={sectionRef} className="relative">
      <div className="shell pb-12 pt-8 sm:pb-14 sm:pt-14">
        {/* phones/tablets: headline > portrait > rest, centred. laptops: text column left, portrait right. */}
        <div className="grid items-start gap-9 text-center sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-10 lg:gap-y-0 lg:text-left">
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
                className="mb-5 inline-flex items-stretch border-2 border-[var(--ink)] bg-[var(--mustard)] text-[var(--on-accent)] sm:mb-6"
              >
                <p className="label px-2.5 py-1.5 text-left leading-relaxed sm:px-3">
                  {t.hero.badge}
                </p>
                <button
                  type="button"
                  onClick={dismissBadge}
                  aria-label={t.hero.badgeClose}
                  className="grid w-8 shrink-0 place-items-center border-l-2 border-[var(--ink)] text-[15px] font-bold leading-none hover:bg-[var(--ink)] hover:text-[var(--mustard)]"
                >
                  <span aria-hidden>✕</span>
                </button>
              </motion.div>
            )}

            <h1 className="display text-[clamp(2.2rem,8.6vw,5.4rem)]">
              <motion.span
                variants={item}
                className="block text-[0.44em] font-semibold tracking-[0.14em] text-[var(--maroon)] sm:tracking-[0.18em]"
              >
                {t.hero.titleTop}
              </motion.span>
              <motion.span variants={item} className="mt-1.5 block sm:mt-2">
                {t.hero.titleMain}
              </motion.span>
              <motion.span
                variants={item}
                className="mt-1 block text-[0.5em] font-semibold"
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
            className="relative mx-auto w-full max-w-[min(320px,72vw)] sm:max-w-[340px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:max-w-[500px]"
          >
            {/* cut-out portrait - no frame */}
            <div className="relative aspect-[4/5]">
              {/* dots drift against the portrait's float for a touch of depth */}
              <motion.div
                className="dots absolute -right-2 top-[6%] h-[46%] w-[46%] opacity-30 sm:-right-4"
                aria-hidden
                animate={reduce ? undefined : { x: [0, 6, 0], y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
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
                    className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,#000_80%,transparent_98%)]"
                    sizes="(max-width: 1024px) 80vw, 500px"
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <TeacherGlyph className="h-32 w-32 text-[var(--ink)] opacity-20 sm:h-48 sm:w-48" />
                  <p className="label absolute bottom-4 px-3 text-center text-[var(--ink-soft)]">
                    public/images/tutor.jpg
                  </p>
                </div>
              )}
            </div>

            {/* name plate, pinned over the foot of the photo */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.2, 0.8, 0.3, 1] }}
              className="hard-sm relative z-10 mx-auto -mt-12 w-[90%] border-2 border-l-[6px] border-[var(--ink)] border-l-[var(--maroon)] bg-[var(--paper)] px-4 py-3 text-left sm:-mt-14 sm:px-5 sm:py-3.5"
            >
              <p className="display text-[19px] leading-tight sm:text-[22px]">{L(site.tutor.name)}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-[var(--ink-soft)] sm:text-[13px]">
                {L(site.tutor.subject)}
              </p>
            </motion.div>
          </motion.div>

          {/* 3. everything else: pitch, calls to action, confirmed classes */}
          <motion.div
            className="w-full lg:col-start-1 lg:row-start-2 lg:mt-6"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.div
              variants={item}
              className="mx-auto flex max-w-3xl items-start justify-center gap-4 border-t-2 border-[var(--ink)] pt-5 sm:gap-5 lg:mx-0 lg:max-w-none lg:justify-start"
            >
              <span className="display hidden shrink-0 text-[3.4rem] leading-none text-[var(--maroon)] sm:block">
                &ldquo;
              </span>
              <p className="max-w-[54ch] text-[14.5px] text-[var(--ink-soft)] sm:text-[15.5px]">
                {t.hero.sub}
              </p>
              <span className="display hidden shrink-0 self-end text-[3.4rem] leading-none text-[var(--maroon)] sm:block">
                &rdquo;
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 lg:justify-start"
            >
              <a
                href={waLink(t.wa.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="press hard inline-flex items-center justify-center gap-2.5 border-2 border-[var(--ink)] bg-[var(--green)] px-5 py-3.5 text-[14.5px] font-bold text-[var(--paper)] sm:px-6 sm:text-[15px]"
              >
                <WhatsAppGlyph className="h-5 w-5 shrink-0" />
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#timetable"
                className="press hard-sm inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-3.5 text-[14.5px] font-semibold sm:px-6 sm:text-[15px]"
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

            {/* torn-ticket strip: one stub per batch, with its class days */}
            <motion.ul
              variants={item}
              className="mx-auto mt-7 grid max-w-3xl border-2 border-[var(--ink)] sm:mt-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none"
            >
              {batches.map((b, i) => {
                const list = sessionsOf(b.id);
                const days = [...new Set(list.map((c) => L(c.day)))];
                const towns = [...new Set(list.map((c) => L(c.town)))];
                return (
                  <li
                    key={b.id}
                    className={`border-dashed border-[var(--ink)] p-4 ${
                      i > 0 ? "border-t-2" : ""
                    } ${i === 1 ? "sm:border-t-0" : ""} ${
                      i % 2 === 0 ? "sm:border-r-2" : ""
                    }`}
                  >
                    <p className="label flex items-center gap-2 text-[var(--maroon)]">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 border border-[var(--ink)]"
                        style={{ background: `var(--batch-${b.id})` }}
                      />
                      {L(b.name)} · {L(b.kind)}
                    </p>
                    <p className="mt-1.5 text-[14px] font-semibold leading-snug sm:text-[14.5px]">
                      {towns.join(", ")}
                    </p>
                    <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--ink-soft)] sm:text-[12.5px]">
                      {days.join(" · ")}
                    </p>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>
      </div>

      {/* stat band */}
      <div className="border-y-2 border-[var(--ink)] bg-[var(--panel)]">
        <dl className="shell grid grid-cols-2 divide-x divide-y divide-[var(--panel-fg)]/20 sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.value} className="px-2 py-4 text-center sm:py-5">
              <dt className="display text-[clamp(1.7rem,6vw,2.7rem)] text-[var(--mustard)]">
                <StatCounter value={s.value} />
              </dt>
              <dd className="label mt-1 leading-relaxed text-[var(--panel-fg)] opacity-80">
                {L(s.label)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* printed ticker */}
      <div className="overflow-hidden border-b-2 border-[var(--ink)] bg-[var(--paper-2)] py-2">
        <div className="marquee-track gap-6">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-6 pr-6"
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
                <span key={w} className="label whitespace-nowrap text-[var(--ink-soft)]">
                  {w} <span className="text-[var(--maroon)]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
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
