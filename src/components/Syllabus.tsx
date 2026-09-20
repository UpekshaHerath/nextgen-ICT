"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { syllabus } from "@/lib/site";

/** Contents page: unit number, title, keywords — two quiet columns. */
export function Syllabus() {
  const { t, L } = useLang();

  return (
    <section
      id="syllabus"
      className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface-2)] py-20 sm:scroll-mt-28 sm:py-28"
    >
      <div className="shell">
        <SectionHead
          no="04"
          eyebrow={t.syllabus.eyebrow}
          title={t.syllabus.title}
          sub={t.syllabus.sub}
        />

        <ol className="mt-9 grid gap-x-12 lg:grid-cols-2">
          {syllabus.map((u, i) => (
            <Reveal as="li" key={u.no} delay={(i % 2) * 40}>
              <div className="flex items-baseline gap-4 border-b border-[var(--line)] py-4">
                <span className="num w-7 shrink-0 text-[13px] font-semibold text-[var(--accent)]">
                  {u.no}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold leading-snug">{L(u.title)}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-3)]">
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
