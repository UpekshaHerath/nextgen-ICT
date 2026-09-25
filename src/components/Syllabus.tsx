"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { syllabus } from "@/lib/site";

/** Syllabus units as a grid of cards: number, title, keywords. */
export function Syllabus() {
  const { t, L } = useLang();

  return (
    <section id="syllabus" className="bg-[var(--bg-soft)] py-16 sm:py-24">
      <div className="shell">
        <SectionHead
          no="04"
          eyebrow={t.syllabus.eyebrow}
          title={t.syllabus.title}
          sub={t.syllabus.sub}
        />

        <ol className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {syllabus.map((u, i) => (
            <Reveal as="li" key={u.no} delay={(i % 3) * 40}>
              <div className="card ring-grad press group flex h-full items-start gap-4 p-4 sm:p-5">
                <span className="display grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-[14px] text-[var(--brand)] transition-colors group-hover:bg-[image:var(--grad)] group-hover:text-[var(--on-brand)]">
                  {u.no}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14.5px] font-bold leading-snug sm:text-[15px]">
                    {L(u.title)}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted)] sm:text-[13px]">
                    {L(u.points)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
