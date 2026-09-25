"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { PhoneGlyph, PinGlyph } from "./BrandIcons";
import { site, whyUs } from "@/lib/site";

export function About() {
  const { t, L } = useLang();

  return (
    <section
      id="about"
      className="border-b-2 border-[var(--ink)] py-14 sm:py-20"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <SectionHead no="01" eyebrow={t.about.eyebrow} title={t.about.title} />

            <Reveal delay={60}>
              <div className="ruled ruled-box mt-6 border-2 border-[var(--ink)] bg-[var(--paper-2)] px-4 sm:mt-7 sm:px-6">
                <p className="text-[14.5px] sm:text-[15px]">{t.about.body1}</p>
                <p className="text-[14.5px] sm:text-[15px]">{t.about.body2}</p>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="mt-5 grid border-2 border-[var(--ink)] sm:mt-6">
                {[t.about.point1, t.about.point2, t.about.point3].map((p, i) => (
                  <li
                    key={p}
                    className={`flex items-start gap-3 px-4 py-3.5 sm:items-center sm:gap-4 sm:px-5 sm:py-4 ${
                      i > 0 ? "border-t-2 border-dashed border-[var(--ink)]" : ""
                    }`}
                  >
                    <span className="label mt-1 shrink-0 text-[var(--maroon)] sm:mt-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] font-medium sm:text-[14.5px]">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                <span className="inline-flex items-center gap-2 border-2 border-[var(--ink)] px-3.5 py-2.5 text-[13px] sm:px-4 sm:text-[13.5px]">
                  <PinGlyph className="h-4 w-4 shrink-0 text-[var(--maroon)]" />
                  {L(site.location)}
                </span>
                <span className="inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--mustard)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--on-accent)] sm:px-4 sm:text-[13.5px]">
                  <PhoneGlyph className="h-4 w-4 shrink-0" />
                  {site.phoneDisplay}
                </span>
              </div>
            </Reveal>
          </div>

          {/* numbered manifesto */}
          <div className="lg:pt-4">
            <Reveal>
              <h3 className="display text-[clamp(1.4rem,4vw,2rem)]">{t.about.whyTitle}</h3>
              <p className="mt-2 text-[14px] text-[var(--ink-soft)] sm:text-[14.5px]">
                {t.about.whySub}
              </p>
            </Reveal>

            <ol className="mt-5 border-t-2 border-[var(--ink)] sm:mt-6">
              {whyUs.map((w, i) => (
                <Reveal as="li" key={w.icon} delay={i * 50}>
                  <div className="group flex gap-4 border-b-2 border-[var(--ink)] py-4 transition-colors hover:bg-[var(--paper-2)] sm:gap-5 sm:py-5">
                    <span className="display w-9 shrink-0 text-[1.8rem] leading-none text-[var(--maroon)] sm:w-12 sm:text-[2.2rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-[15px] font-bold leading-snug sm:text-[15.5px]">
                        {L(w.title)}
                      </h4>
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-soft)] sm:text-[13.5px]">
                        {L(w.desc)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
