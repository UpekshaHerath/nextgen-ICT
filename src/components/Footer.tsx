"use client";

import { useLang } from "./LanguageProvider";
import { site, telLink } from "@/lib/site";

export function Footer() {
  const { t, L } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="panel">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.5fr_0.75fr_0.75fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[var(--accent)] text-[var(--on-accent)]">
              <span className="eyebrow text-[10px] tracking-[0.08em]">ICT</span>
            </span>
            <span className="leading-tight">
              <span className="display block text-[19px]">NextGen ICT</span>
              <span className="block text-[12px] text-[var(--panel-muted)]">
                with Subhashana
              </span>
            </span>
          </div>
          <p className="mt-6 max-w-[42ch] text-[13.5px] leading-relaxed text-[var(--panel-muted)]">
            {L(site.tutor.role)} · {L(site.location)}
          </p>
          <p className="display mt-5 max-w-[24ch] text-[clamp(1.15rem,3.4vw,1.6rem)]">
            {L(site.tutor.tagline)}
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-[var(--panel-muted)]">{t.footer.quick}</h3>
          <ul className="mt-4 grid gap-2.5 text-[13.5px]">
            {(["about", "classes", "timetable", "syllabus", "faq"] as const).map((k) => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  className="text-[var(--panel-fg)]/85 transition-colors hover:text-[var(--accent)]"
                >
                  {t.nav[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-[var(--panel-muted)]">{t.footer.contact}</h3>
          <ul className="mt-4 grid gap-2.5 text-[13.5px]">
            <li>
              <a
                href={telLink}
                className="text-[var(--panel-fg)]/85 transition-colors hover:text-[var(--accent)]"
              >
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--panel-fg)]/85 transition-colors hover:text-[var(--accent)]"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={site.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-[var(--panel-fg)]/85 transition-colors hover:text-[var(--accent)]"
              >
                TikTok @{site.tiktokHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--panel-line)]">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-5">
          <p className="text-[12px] text-[var(--panel-muted)]">
            © {year} NextGen ICT. {t.footer.rights}
          </p>
          <p className="text-[12px] text-[var(--panel-muted)]">{t.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
