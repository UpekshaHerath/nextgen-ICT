"use client";

import Image from "next/image";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { gallery, site } from "@/lib/site";

type Photo = (typeof gallery)[number];

/**
 * Three rows of photos drifting in alternating directions. Each row carries
 * every photo, started at a different offset so the rows never line up, and is
 * printed twice so the -50% loop in `.marquee-track` joins without a seam.
 */
const ROWS = [
  { offset: 0, reverse: false, seconds: 60 },
  { offset: 3, reverse: true, seconds: 72 },
  { offset: 6, reverse: false, seconds: 66 },
];

const rotate = (list: Photo[], by: number) => [
  ...list.slice(by % list.length),
  ...list.slice(0, by % list.length),
];

export function Gallery() {
  const { t } = useLang();

  return (
    <section id="gallery" className="overflow-hidden py-16 sm:py-24">
      <div className="shell">
        <SectionHead
          no="05"
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          sub={t.gallery.sub}
        />
      </div>

      <Reveal className="mt-8 grid gap-3 sm:mt-10 sm:gap-4">
        {ROWS.map((row, r) => {
          const photos = rotate(gallery, row.offset);
          return (
            <div key={r} className="gallery-row marquee-mask overflow-hidden">
              <ul
                className={`marquee-track ${row.reverse ? "marquee-reverse" : ""}`}
                style={{ animationDuration: `${row.seconds}s` }}
              >
                {[0, 1].map((dup) =>
                  photos.map((g) => (
                    <GalleryTile key={`${dup}-${g.id}`} g={g} hidden={dup === 1} />
                  )),
                )}
              </ul>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}

function GalleryTile({ g, hidden }: { g: Photo; hidden: boolean }) {
  const { t, L } = useLang();

  return (
    <li aria-hidden={hidden || undefined} className="shrink-0 pr-3 sm:pr-4">
      <figure
        className={`group relative h-[150px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)] shadow-[var(--shadow-sm)] sm:h-[200px] sm:rounded-3xl lg:h-[240px] ${
          g.wide ? "w-[225px] sm:w-[300px] lg:w-[360px]" : "w-[120px] sm:w-[160px] lg:w-[192px]"
        }`}
      >
        {g.src ? (
          <Image
            src={g.src}
            alt={
              hidden
                ? ""
                : `${L(g.caption)} — ${L(site.brand)} ${L(site.tutor.subject)}, ${L(site.tutor.name)}`
            }
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes={g.wide ? "(max-width: 640px) 225px, (max-width: 1024px) 300px, 360px" : "(max-width: 640px) 120px, (max-width: 1024px) 160px, 192px"}
          />
        ) : (
          <div className="dots absolute inset-0 grid place-items-center">
            <span className="label rounded-full bg-[var(--surface)] px-3 py-1.5 text-center">
              {t.gallery.placeholder}
            </span>
          </div>
        )}
        {/* caption fades up on hover, riding a dark gradient */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-[12px] font-semibold leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-4 sm:text-[13px]">
          {L(g.caption)}
        </figcaption>
      </figure>
    </li>
  );
}
