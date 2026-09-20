"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { faqs } from "@/lib/site";

export function Faq() {
  const { t, L } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-b-2 border-[var(--ink)] py-14 sm:py-20"
    >
      <div className="shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-10">
        <SectionHead no="07" eyebrow={t.faq.eyebrow} title={t.faq.title} />

        <div className="border-t-2 border-[var(--ink)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q.en} delay={i * 40}>
                <div
                  className={`border-b-2 border-[var(--ink)] transition-colors ${
                    isOpen ? "bg-[var(--paper-2)]" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-baseline gap-3 px-1.5 py-3.5 text-left sm:gap-4 sm:px-2 sm:py-4"
                  >
                    <span className="label shrink-0 text-[var(--maroon)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[14.5px] font-bold leading-snug sm:text-[15px]">
                      {L(f.q)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      className="display shrink-0 text-[1.3rem] leading-none sm:text-[1.4rem]"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-1.5 pb-4 pl-[2.9rem] text-[13.5px] leading-relaxed text-[var(--ink-soft)] sm:px-2 sm:pb-5 sm:pl-[3.6rem] sm:text-[14px]">
                          {L(f.a)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
