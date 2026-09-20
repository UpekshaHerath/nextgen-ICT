"use client";

import { useRef } from "react";
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
import { classes, site, stats, tutorPhoto, waLink } from "@/lib/site";

/** Page-load choreography for the headline column. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.3, 1] } },
};

export function Hero() {
  const { t, L } = useLang();
  const verified = classes.filter((c) => c.verified);
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // gentle parallax: the portrait drifts slower than the copy beside it
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 48]);

  return (
    <section id="home" ref={sectionRef} className="relative overflow-hidden">
      <div
        className="grid-faint pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      />

      <div className="shell relative pb-14 pt-10 sm:pb-20 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* headline column — always first, so phones open on the message */}
          <motion.div
            className="order-1"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.p variants={item} className="chip chip-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
              {t.hero.badge}
            </motion.p>

            <h1 className="display mt-6 text-[clamp(2.4rem,6.8vw,4.4rem)]">
              <motion.span
                variants={item}
                className="eyebrow block font-[family-name:var(--font-ui)] text-[var(--ink-3)]"
              >
                {t.hero.titleTop}
              </motion.span>
              <motion.span variants={item} className="mt-2.5 block">
                {t.hero.titleMain}
              </motion.span>
              <motion.span
                variants={item}
                className="mt-1 block text-[0.42em] font-semibold leading-snug text-[var(--accent)]"
              >
                {t.hero.titleBottom}
              </motion.span>
            </h1>

            <motion.p variants={item} className="lede mt-6 max-w-[52ch]">
              {t.hero.sub}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <a
                href={waLink(t.wa.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppGlyph className="h-[18px] w-[18px] shrink-0" />
                {t.hero.ctaPrimary}
              </a>
              <a href="#timetable" className="btn btn-ghost">
                {t.hero.ctaSecondary}
                <span aria-hidden className="text-[var(--ink-3)]">
                  ↓
                </span>
              </a>
            </motion.div>

            {/* confirmed classes, set as a small schedule block */}
            <motion.div variants={item} className="mt-10 border-t border-[var(--line)] pt-6">
              <p className="eyebrow text-[var(--ink-3)]">
                {L(site.location)} · {L(site.medium)}
              </p>
              <ul className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {verified.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <span
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold leading-snug">
                        {L(c.institute)} — {L(c.town)}
                      </span>
                      <span className="num block text-[12.5px] text-[var(--ink-3)]">
                        {L(c.day)} · {L(c.time)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* portrait column */}
          <motion.div
            style={{ y: portraitY }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.8, 0.3, 1] }}
            className="relative order-2 mx-auto w-full max-w-[min(360px,80vw)] sm:max-w-[400px] lg:max-w-[440px]"
          >
            <figure className="card overflow-hidden shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[4/5] bg-[var(--surface-2)]">
                {tutorPhoto ? (
                  <Image
                    src={tutorPhoto}
                    alt={`${L(site.tutor.name)} — ${L(site.tutor.role)}, ${L(site.location)}`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 80vw, 440px"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <TeacherGlyph className="h-32 w-32 text-[var(--ink-3)] opacity-30 sm:h-40 sm:w-40" />
                    <p className="eyebrow absolute bottom-5 px-3 text-center text-[var(--ink-3)]">
                      public/images/tutor.jpg
                    </p>
                  </div>
                )}
              </div>
              <figcaption className="border-t border-[var(--line)] px-5 py-4">
                <p className="display text-[20px]">{L(site.tutor.name)}</p>
                <p className="mt-1 text-[13px] leading-snug text-[var(--ink-2)]">
                  {L(site.tutor.subject)}
                </p>
                <p className="eyebrow mt-2.5 text-[var(--accent)]">
                  {L(site.tutor.qualification)}
                </p>
              </figcaption>
            </figure>

            {/* second photo, tucked into the corner as a small inset print */}
            <motion.figure
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.2, 0.8, 0.3, 1] }}
              className="absolute -left-5 bottom-24 z-10 hidden w-[38%] overflow-hidden rounded-[var(--r)] border-4 border-[var(--canvas)] shadow-[var(--shadow-lg)] sm:block lg:-left-8"
            >
              <div className="relative aspect-square bg-[var(--surface-2)]">
                <Image
                  src="/images/tutor-2.jpg"
                  alt={`${L(site.tutor.name)} — ${L(site.tutor.subject)} ${L(site.medium)}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </motion.figure>

            {/* batch badge */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="absolute -right-2 top-5 z-10 rounded-full bg-[var(--panel)] px-3.5 py-2 text-center shadow-[var(--shadow-lg)] lg:-right-5"
            >
              <span className="eyebrow block text-[var(--panel-fg)]">2027 batch</span>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* stat band */}
      <div className="panel relative">
        <dl className="shell grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-4 sm:py-12">
          {stats.map((s, i) => (
            <div
              key={s.value}
              className={`px-2 text-center sm:px-4 ${
                i > 0 ? "sm:border-l sm:border-[var(--panel-line)]" : ""
              }`}
            >
              <dt className="display text-[clamp(1.9rem,5vw,2.6rem)] text-[var(--panel-fg)]">
                <StatCounter value={s.value} />
              </dt>
              <dd className="eyebrow mt-2 text-[var(--panel-muted)]">{L(s.label)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* subject ticker */}
      <div className="overflow-hidden border-b border-[var(--line)] bg-[var(--surface-2)] py-3">
        <div className="marquee-track gap-8">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-8 pr-8"
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
                "A/L 2026",
                "A/L 2027",
              ].map((w) => (
                <span
                  key={w}
                  className="flex items-center gap-8 whitespace-nowrap text-[12.5px] font-medium text-[var(--ink-3)]"
                >
                  {w}
                  <span className="h-1 w-1 rounded-full bg-[var(--line-strong)]" aria-hidden />
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
