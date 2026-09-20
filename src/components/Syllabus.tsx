"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { syllabus } from "@/lib/site";

/** Book contents page: number, title, keywords. */
export function Syllabus() {
  const { t, L } = useLang();

  return (
    <section
      id="syllabus"
      className="border-b-2 border-[var(--ink)] bg-[var(--paper-2)] py-14 sm:py-20"
    >
      <div className="shell">
        <SectionHead
          no="04"
          eyebrow={t.syllabus.eyebrow}
          title={t.syllabus.title}
          sub={t.syllabus.sub}
        />

        <ol className="mt-7 grid gap-x-10 border-t-2 border-[var(--ink)] sm:mt-8 lg:grid-cols-2 lg:gap-x-12">
          {syllabus.map((u, i) => (
            <Reveal as="li" key={u.no} delay={(i % 2) * 40}>
              <div className="group flex items-baseline gap-3.5 border-b-2 border-[var(--ink)] py-3.5 sm:gap-4 sm:py-4">
                <span className="display w-8 shrink-0 text-[1.3rem] leading-none text-[var(--maroon)] sm:w-9 sm:text-[1.5rem]">
                  {u.no}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14.5px] font-bold leading-snug sm:text-[15px]">
                    {L(u.title)}
                  </h3>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-[var(--ink-soft)] sm:text-[13px]">
                    {L(u.points)}
                  </p>
                </div>
                <span
                  className="label hidden shrink-0 self-center text-[var(--ink-soft)] opacity-0 transition-opacity group-hover:opacity-100 lg:block"
                  aria-hidden
                >
                  ✓
                </span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
