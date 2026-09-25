"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { PhoneGlyph, PinGlyph } from "./BrandIcons";
import { site, whyUs } from "@/lib/site";

export function About() {
  const { t, L } = useLang();

  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHead no="01" eyebrow={t.about.eyebrow} title={t.about.title} />

            <Reveal delay={60}>
              <div className="card mt-7 grid gap-4 p-5 text-[15px] leading-relaxed text-[var(--muted)] sm:p-7 sm:text-[15.5px]">
                <p>{t.about.body1}</p>
                <p>{t.about.body2}</p>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="mt-5 grid gap-2.5 sm:mt-6">
                {[t.about.point1, t.about.point2, t.about.point3].map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 sm:items-center sm:px-5"
                  >
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[11px] font-bold text-[var(--on-brand)] sm:mt-0">
                      ✓
                    </span>
                    <span className="text-[14px] font-medium sm:text-[14.5px]">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[13px] font-medium sm:text-[13.5px]">
                  <PinGlyph className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {L(site.location)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] px-4 py-2.5 text-[13px] font-semibold text-[var(--brand)] sm:text-[13.5px]">
                  <PhoneGlyph className="h-4 w-4 shrink-0" />
                  {site.phoneDisplay}
                </span>
              </div>
            </Reveal>
          </div>

          {/* why us: a grid of feature cards */}
          <div className="lg:pt-2">
            <Reveal>
              <h3 className="display text-[clamp(1.4rem,4vw,2rem)]">{t.about.whyTitle}</h3>
              <p className="mt-2 text-[14px] text-[var(--muted)] sm:text-[15px]">
                {t.about.whySub}
              </p>
            </Reveal>

            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {whyUs.map((w, i) => (
                <Reveal as="li" key={w.icon} delay={i * 50}>
                  <div className="card ring-grad press group h-full p-5">
                    <span className="display grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-[15px] text-[var(--brand)] transition-colors group-hover:bg-[var(--brand)] group-hover:text-[var(--on-brand)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-4 text-[15px] font-bold leading-snug sm:text-[15.5px]">
                      {L(w.title)}
                    </h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)] sm:text-[13.5px]">
                      {L(w.desc)}
                    </p>
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
