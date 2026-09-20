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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.3, 1] } },
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
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const stickerRotate = useTransform(scrollYProgress, [0, 1], [-12, reduce ? -12 : 16]);

  return (
    <section id="home" ref={sectionRef} className="relative">
      <div className="shell pb-12 pt-8 sm:pb-14 sm:pt-14">
        <div className="grid items-start gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          {/* headline column - always first, so phones open on the message */}
          <motion.div
            className="order-1"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.p
              variants={item}
              className="label inline-block border-2 border-[var(--ink)] bg-[var(--mustard)] px-2.5 py-1.5 leading-relaxed sm:px-3"
            >
              {t.hero.badge}
            </motion.p>

            <h1 className="display mt-5 text-[clamp(2.2rem,8.6vw,5.4rem)] sm:mt-6">
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

            <motion.div
              variants={item}
              className="mt-5 flex items-start gap-4 border-t-2 border-[var(--ink)] pt-5 sm:mt-6 sm:gap-5"
            >
              <span className="display hidden shrink-0 text-[3.4rem] leading-none text-[var(--maroon)] sm:block">
                &ldquo;
              </span>
              <p className="max-w-[54ch] text-[14.5px] text-[var(--ink-soft)] sm:text-[15.5px]">
                {t.hero.sub}
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
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

            {/* torn-ticket strip of confirmed classes */}
            <motion.ul
              variants={item}
              className="mt-7 grid border-2 border-[var(--ink)] sm:mt-8 sm:grid-cols-2"
            >
              {verified.map((c, i) => (
                <li
                  key={c.id}
                  className={`p-4 ${
                    i === 0 ? "sm:border-r-2 sm:border-dashed sm:border-[var(--ink)]" : ""
                  } ${i > 0 ? "border-t-2 border-dashed border-[var(--ink)] sm:border-t-0" : ""}`}
                >
                  <p className="label text-[var(--maroon)]">{L(c.kind)}</p>
                  <p className="mt-1.5 text-[14px] font-semibold leading-snug sm:text-[14.5px]">
                    {L(c.institute)} - {L(c.town)}
                  </p>
                  <p className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--ink-soft)] sm:text-[12.5px]">
                    {L(c.day)} · {L(c.time)}
                  </p>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* portrait column - capped well below the fold height on small screens */}
          <motion.div
            style={{ y: portraitY }}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.3, 1] }}
            className="relative order-2 mx-auto w-full max-w-[min(320px,72vw)] sm:max-w-[340px] lg:mt-3 lg:max-w-[400px]"
          >
            <div
              className="dots absolute -left-3 -top-3 h-20 w-20 opacity-25 sm:-left-5 sm:-top-5 sm:h-32 sm:w-32"
              aria-hidden
            />
            <div
              className="absolute inset-0 translate-x-2 translate-y-2 bg-[var(--maroon)] sm:translate-x-3 sm:translate-y-3"
              aria-hidden
            />

            <figure className="relative border-2 border-[var(--ink)] bg-[var(--paper-2)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                {tutorPhoto ? (
                  <Image
                    src={tutorPhoto}
                    alt={L(site.tutor.name)}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 80vw, 400px"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <TeacherGlyph className="h-32 w-32 text-[var(--ink)] opacity-20 sm:h-48 sm:w-48" />
                    <p className="label absolute bottom-4 px-3 text-center text-[var(--ink-soft)]">
                      public/images/tutor.jpg
                    </p>
                  </div>
                )}
              </div>
              <figcaption className="border-t-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3">
                <p className="display text-[19px] sm:text-[22px]">{L(site.tutor.name)}</p>
                <p className="mt-1 text-[12px] leading-snug text-[var(--ink-soft)] sm:text-[12.5px]">
                  {L(site.tutor.role)}
                </p>
                <p className="label mt-1.5 text-[var(--maroon)]">
                  {L(site.tutor.qualification)}
                </p>
              </figcaption>
            </figure>

            {/* second photo, tucked under the main frame like a loose print */}
            <motion.figure
              initial={reduce ? false : { opacity: 0, x: -24, rotate: -12 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ duration: 0.55, delay: 0.4, ease: [0.2, 0.8, 0.3, 1] }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              className="hard-sm absolute -left-10 -top-8 z-10 hidden w-[36%] border-2 border-[var(--ink)] bg-[var(--paper)] p-1.5 sm:block"
            >
              <div className="relative aspect-square">
                <Image
                  src="/images/tutor-2.jpg"
                  alt={`${L(site.tutor.name)} - ${L(site.tutor.role)}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </motion.figure>

            {/* rotated sticker */}
            <motion.div
              style={{ rotate: stickerRotate }}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.55 }}
              className="absolute -right-2 -top-4 grid h-[72px] w-[72px] place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--mustard)] text-center sm:-right-3 sm:-top-6 sm:h-24 sm:w-24"
            >
              <span className="display text-[11px] leading-tight sm:text-[13px]">
                2027
                <br />
                BATCH
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* stat band */}
      <div className="border-y-2 border-[var(--ink)] bg-[var(--ink)]">
        <dl className="shell grid grid-cols-2 divide-x divide-y divide-[var(--paper)]/20 sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.value} className="px-2 py-4 text-center sm:py-5">
              <dt className="display text-[clamp(1.7rem,6vw,2.7rem)] text-[var(--mustard)]">
                <StatCounter value={s.value} />
              </dt>
              <dd className="label mt-1 leading-relaxed text-[var(--paper)] opacity-80">
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
                "A/L 2026",
                "A/L 2027",
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
