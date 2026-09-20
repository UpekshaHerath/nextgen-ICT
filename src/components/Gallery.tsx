"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { gallery } from "@/lib/site";

const TILT = ["-1.6deg", "1.2deg", "-0.8deg", "1.8deg", "-1.2deg", "0.9deg"];

/** Photo prints pinned to a board, each slightly off-square. */
export function Gallery() {
  const { t, L } = useLang();
  const reduce = useReducedMotion();

  return (
    <section
      id="gallery"
      className="scroll-mt-24 border-b-2 border-[var(--ink)] py-14 sm:scroll-mt-28 sm:py-20"
    >
      <div className="shell">
        <SectionHead
          no="05"
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          sub={t.gallery.sub}
        />

        {/* dense flow lets the narrow tiles backfill the gaps the wide ones leave */}
        <ul className="mt-8 grid gap-6 [grid-auto-flow:dense] sm:mt-9 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal
              as="li"
              key={g.id}
              delay={(i % 3) * 50}
              className={g.wide ? "sm:col-span-2" : ""}
            >
              <motion.figure
                initial={{ rotate: TILT[i % TILT.length] }}
                whileHover={reduce ? {} : { rotate: 0, scale: 1.02, zIndex: 5 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="hard-sm relative border-2 border-[var(--ink)] bg-[var(--paper)] p-2 pb-0 sm:p-2.5"
              >
                <div
                  className={`relative overflow-hidden border border-[var(--ink)] bg-[var(--paper-2)] ${
                    g.wide ? "aspect-[3/2]" : "aspect-[3/4]"
                  }`}
                >
                  {g.src ? (
                    <Image
                      src={g.src}
                      alt={L(g.caption)}
                      fill
                      className="object-cover"
                      sizes={
                        g.wide
                          ? "(max-width: 640px) 90vw, (max-width: 1024px) 90vw, 66vw"
                          : "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                      }
                    />
                  ) : (
                    <div className="dots absolute inset-0 grid place-items-center opacity-30">
                      <span className="label bg-[var(--paper)] px-2 py-1 text-center">
                        {t.gallery.placeholder}
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="px-1 py-2.5 text-[12.5px] font-medium sm:py-3 sm:text-[13px]">
                  {L(g.caption)}
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
