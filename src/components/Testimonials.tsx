"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { testimonials } from "@/lib/site";

/** Quote cards from students and parents. */
export function Testimonials() {
  const { t, L } = useLang();
  const reduce = useReducedMotion();

  return (
    <section className="bg-[var(--bg-soft)] py-16 sm:py-24">
      <div className="shell">
        <SectionHead
          no="06"
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
        />

        <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {testimonials.map((tm, i) => (
            <Reveal as="li" key={tm.name.en} delay={i * 60}>
              <motion.figure
                whileHover={reduce ? {} : { y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="card ring-grad relative flex h-full flex-col rounded-3xl p-6 hover:shadow-[var(--shadow-lg)] sm:p-7"
              >
                <span aria-hidden className="display grad-text text-[3.2rem] leading-[0.6]">
                  &ldquo;
                </span>
                <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed sm:text-[15px]">
                  {L(tm.quote)}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] font-[family-name:var(--font-display)] text-[17px] font-bold text-[var(--on-brand)]">
                    {L(tm.name).charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold">{L(tm.name)}</span>
                    <span className="block truncate text-[12.5px] text-[var(--muted)]">
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
