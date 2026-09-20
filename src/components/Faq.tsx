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
    <section id="faq" className="scroll-mt-24 py-20 sm:scroll-mt-28 sm:py-28">
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
        <SectionHead no="07" eyebrow={t.faq.eyebrow} title={t.faq.title} />

        <div className="card overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q.en} delay={i * 40}>
                <div
                  className={`border-[var(--line)] ${i > 0 ? "border-t" : ""} ${
                    isOpen ? "bg-[var(--surface-2)]" : ""
                  } transition-colors`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="flex-1 text-[15px] font-semibold leading-snug">
                      {L(f.q)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.3, 1] }}
                      className="mt-0.5 shrink-0 text-[var(--ink-3)]"
                      aria-hidden
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                        <path
                          d="m5 7.5 5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
                        <p className="px-5 pb-5 pr-12 text-[14px] leading-relaxed text-[var(--ink-2)] sm:px-6 sm:pb-6">
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
