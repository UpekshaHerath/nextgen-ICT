"use client";

import { useLang } from "./LanguageProvider";
import { site, telLink } from "@/lib/site";

export function Footer() {
  const { t, L } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-[var(--ink)] bg-[var(--panel)] text-[var(--panel-fg)]">
      <div className="shell grid gap-8 py-10 sm:grid-cols-2 sm:gap-10 sm:py-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-[var(--panel-fg)] bg-[var(--maroon)] font-[family-name:var(--font-mono)] text-[12px]">
              ICT
            </span>
            <span className="leading-none">
              <span className="display block text-[20px]">NextGen ICT</span>
              <span className="label mt-1 block opacity-70">with Subhashana</span>
            </span>
          </div>
          <p className="mt-4 max-w-[40ch] text-[13px] leading-relaxed opacity-75 sm:text-[13.5px]">
            {L(site.tutor.role)} · {L(site.location)}
          </p>
          <p className="display mt-4 text-[clamp(1.1rem,4.4vw,1.7rem)] text-[var(--mustard)] sm:mt-5">
            {L(site.tutor.tagline)}
          </p>
        </div>

        <div>
          <h3 className="label border-b border-[var(--panel-fg)]/30 pb-2 opacity-70">
            {t.footer.quick}
          </h3>
          <ul className="mt-3 grid gap-2 text-[13.5px]">
            {(["about", "classes", "timetable", "syllabus", "faq"] as const).map((k) => (
              <li key={k}>
                <a href={`#${k}`} className="hover:text-[var(--mustard)]">
                  {t.nav[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label border-b border-[var(--panel-fg)]/30 pb-2 opacity-70">
            {t.footer.contact}
          </h3>
          <ul className="mt-3 grid gap-2 text-[13.5px]">
            <li>
              <a href={telLink} className="hover:text-[var(--mustard)]">
                ☏ {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--mustard)]"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={site.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all hover:text-[var(--mustard)]"
              >
                TikTok @{site.tiktokHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--panel-fg)]/25">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-4">
          <p className="label opacity-60">
            © {year} NextGen ICT. {t.footer.rights}
          </p>
          <p className="label opacity-60">{t.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
