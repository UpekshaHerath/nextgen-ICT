"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { faqs } from "@/lib/site";

export function Faq() {
  const { t, L } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
        <SectionHead no="07" eyebrow={t.faq.eyebrow} title={t.faq.title} />

        <div className="grid gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q.en} delay={i * 40}>
                <div
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[var(--line-strong)] bg-[var(--surface)] shadow-[var(--shadow)]"
                      : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                  >
                    <span className="flex-1 text-[14.5px] font-semibold leading-snug sm:text-[15.5px]">
                      {L(f.q)}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 24 }}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[18px] leading-none transition-colors ${
                        isOpen
                          ? "bg-[image:var(--grad)] text-[var(--on-brand)]"
                          : "bg-[var(--bg-soft)] text-[var(--fg)]"
                      }`}
                      aria-hidden
                    >
                      {isOpen ? "−" : "+"}
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
                        <p className="px-4 pb-5 text-[14px] leading-relaxed text-[var(--muted)] sm:px-5 sm:text-[14.5px]">
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
