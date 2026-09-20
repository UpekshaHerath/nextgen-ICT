"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { testimonials } from "@/lib/site";

/** Student quotes, each on its own card with the attribution at the foot. */
export function Testimonials() {
  const { t, L } = useLang();

  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface-2)] py-20 sm:py-28">
      <div className="shell">
        <SectionHead
          no="06"
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((tm, i) => (
            <Reveal as="li" key={tm.name.en} delay={i * 60}>
              <figure className="card card-lift flex h-full flex-col p-6 sm:p-7">
                <span
                  className="display text-[2.4rem] leading-[0.7] text-[var(--accent)]"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <blockquote className="mt-3 flex-1 text-[14.5px] leading-[1.75] text-[var(--ink-2)]">
                  {L(tm.quote)}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] font-[family-name:var(--font-display)] text-[16px] font-bold text-[var(--accent)]">
                    {L(tm.name).charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold">{L(tm.name)}</span>
                    <span className="block truncate text-[12.5px] text-[var(--ink-3)]">
                      {L(tm.role)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
