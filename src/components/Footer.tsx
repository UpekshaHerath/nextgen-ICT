"use client";

import { useLang } from "./LanguageProvider";
import { ChannelBadge } from "./BrandIcons";
import { site, telLink, waLink } from "@/lib/site";

export function Footer() {
  const { t, L } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[var(--panel)] text-[var(--panel-fg)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[var(--panel-fg)]/10" />
      <div className="shell grid gap-8 py-10 sm:grid-cols-2 sm:gap-10 sm:py-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--brand)] font-[family-name:var(--font-mono)] text-[11px] font-bold text-white">
              ICT
            </span>
            <span className="leading-none">
              <span className="display block text-[20px]">NextGen ICT</span>
              <span className="mt-1 block text-[12px] opacity-60">with Subhashana</span>
            </span>
          </div>
          <p className="mt-4 max-w-[40ch] text-[13px] leading-relaxed opacity-75 sm:text-[13.5px]">
            {L(site.tutor.role)} · {L(site.location)}
          </p>
          <p className="display mt-4 text-[clamp(1.1rem,4.4vw,1.7rem)] sm:mt-5">
            {L(site.tutor.tagline)}
          </p>
        </div>

        <div>
          <h3 className="label pb-1 opacity-60">
            {t.footer.quick}
          </h3>
          <ul className="mt-3 grid gap-2 text-[13.5px]">
            {(["about", "classes", "timetable", "syllabus", "faq"] as const).map((k) => (
              <li key={k}>
                <a href={`#${k}`} className="opacity-80 transition-opacity hover:opacity-100">
                  {t.nav[k]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label pb-1 opacity-60">
            {t.footer.contact}
          </h3>
          <ul className="mt-3 grid gap-2 text-[13.5px]">
            <li>
              <a href={telLink} className="inline-flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100">
                <ChannelBadge channel="phone" className="h-7 w-7 !rounded-lg" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={waLink(t.wa.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100"
              >
                <ChannelBadge channel="whatsapp" className="h-7 w-7 !rounded-lg" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100"
              >
                <ChannelBadge channel="facebook" className="h-7 w-7 !rounded-lg" />
                Facebook
              </a>
            </li>
            <li>
              <a
                href={site.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 break-all opacity-80 transition-opacity hover:opacity-100"
              >
                <ChannelBadge channel="tiktok" className="h-7 w-7 !rounded-lg" />
                TikTok @{site.tiktokHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--panel-fg)]/10">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-4">
          <p className="text-[12px] opacity-50">
            © {year} NextGen ICT. {t.footer.rights}
          </p>
          <p className="text-[12px] opacity-50">{t.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
