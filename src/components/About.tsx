"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { site, telLink, whyUs } from "@/lib/site";

export function About() {
  const { t, L } = useLang();

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:scroll-mt-28 sm:py-28">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHead no="01" eyebrow={t.about.eyebrow} title={t.about.title} />

            <Reveal delay={60}>
              <div className="mt-7 space-y-4 text-[15px] leading-[1.8] text-[var(--ink-2)]">
                <p>{t.about.body1}</p>
                <p>{t.about.body2}</p>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="mt-8 space-y-3.5 border-t border-[var(--line)] pt-7">
                {[t.about.point1, t.about.point2, t.about.point3].map((p) => (
                  <li key={p} className="flex gap-3.5">
                    <CheckGlyph className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[var(--accent)]" />
                    <span className="text-[14.5px] font-medium leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <span className="chip">{L(site.location)}</span>
                <span className="chip">{L(site.medium)}</span>
                <a href={telLink} className="chip chip-accent">
                  {site.phoneDisplay}
                </a>
              </div>
            </Reveal>
          </div>

          {/* why us — a numbered list set as its own quiet column */}
          <div>
            <Reveal>
              <h3 className="display text-[clamp(1.35rem,3.2vw,1.85rem)]">
                {t.about.whyTitle}
              </h3>
              <p className="mt-2.5 text-[14.5px] text-[var(--ink-2)]">{t.about.whySub}</p>
            </Reveal>

            <ol className="mt-8 grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-[var(--line)] bg-[var(--line)]">
              {whyUs.map((w, i) => (
                <Reveal as="li" key={w.icon} delay={i * 50}>
                  <div className="flex h-full gap-4 bg-[var(--surface)] px-5 py-5 transition-colors hover:bg-[var(--surface-2)] sm:px-6">
                    <span className="num shrink-0 text-[13px] font-semibold text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-[15px] font-semibold leading-snug">
                        {L(w.title)}
                      </h4>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink-2)]">
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

function CheckGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
      <path
        d="m6.3 10.2 2.5 2.5 5-5.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
