"use client";

import Image from "next/image";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { gallery, site } from "@/lib/site";

/** Photographs, squared to the grid, captions set beneath the frame. */
export function Gallery() {
  const { t, L } = useLang();

  return (
    <section id="gallery" className="scroll-mt-24 py-20 sm:scroll-mt-28 sm:py-28">
      <div className="shell">
        <SectionHead
          no="05"
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          sub={t.gallery.sub}
        />

        {/* dense flow lets the narrow tiles backfill the gaps the wide ones leave */}
        <ul className="mt-9 grid gap-5 [grid-auto-flow:dense] sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal
              as="li"
              key={g.id}
              delay={(i % 3) * 50}
              className={g.wide ? "sm:col-span-2" : ""}
            >
              <figure className="group h-full">
                <div
                  className={`relative overflow-hidden rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--surface-2)] ${
                    g.wide ? "aspect-[3/2]" : "aspect-[4/5]"
                  }`}
                >
                  {g.src ? (
                    <Image
                      src={g.src}
                      alt={`${L(g.caption)} — ${L(site.brand)} ${L(site.tutor.subject)}, ${L(site.tutor.name)}`}
                      fill
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.3,1)] group-hover:scale-[1.03]"
                      sizes={
                        g.wide
                          ? "(max-width: 640px) 90vw, (max-width: 1024px) 90vw, 66vw"
                          : "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                      }
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="eyebrow text-center text-[var(--ink-3)]">
                        {t.gallery.placeholder}
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="mt-3 text-[13px] text-[var(--ink-2)]">
                  {L(g.caption)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
