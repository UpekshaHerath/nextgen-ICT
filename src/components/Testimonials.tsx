"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { testimonials } from "@/lib/site";

const TILT = ["-1.2deg", "0.8deg", "-0.6deg"];

/** Notes taped to the wall. */
export function Testimonials() {
  const { t, L } = useLang();
  const reduce = useReducedMotion();

  return (
    <section className="border-b-2 border-[var(--ink)] bg-[var(--paper-2)] py-14 sm:py-20">
      <div className="shell">
        <SectionHead
          no="06"
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
        />

        <ul className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-9 lg:grid-cols-3">
          {testimonials.map((tm, i) => (
            <Reveal as="li" key={tm.name.en} delay={i * 60}>
              <motion.figure
                initial={{ rotate: TILT[i % TILT.length] }}
                whileHover={reduce ? {} : { rotate: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="hard-sm relative h-full border-2 border-[var(--ink)] bg-[var(--paper)] p-5 sm:p-6"
              >
                <span className="tape" aria-hidden />
                <blockquote className="ruled text-[14px] sm:text-[14.5px]">
                  {L(tm.quote)}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 border-t-2 border-dashed border-[var(--ink)] pt-4 sm:mt-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[var(--ink)] bg-[var(--maroon)] font-[family-name:var(--font-display)] text-[17px] font-bold text-[var(--paper)]">
                    {L(tm.name).charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold">{L(tm.name)}</span>
                    <span className="label block truncate text-[var(--ink-soft)]">
                      {L(tm.role)}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
