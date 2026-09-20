"use client";

import { useMemo, useState } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import { classes, site, telLink, waLink } from "@/lib/site";

/** Paper registration slip — fills a WhatsApp message instead of a database. */
export function Contact() {
  const { t, L, lang } = useLang();
  const [name, setName] = useState("");
  const [classId, setClassId] = useState(classes[0].id);
  const [note, setNote] = useState("");

  const href = useMemo(() => {
    const c = classes.find((x) => x.id === classId) ?? classes[0];
    const lines = [
      t.wa.classPrefix,
      "",
      `• ${L(c.title)}`,
      `• ${L(c.institute)}, ${L(c.town)}`,
      `• ${L(c.day)} ${L(c.time)}`,
    ];
    if (name.trim()) lines.push("", `${t.contact.name}: ${name.trim()}`);
    if (note.trim()) lines.push(`${t.contact.note}: ${note.trim()}`);
    return waLink(lines.join("\n"));
  }, [classId, name, note, t, L]);

  // One card per venue; prefer the class whose day/time is confirmed.
  const venues = Array.from(
    classes
      .reduce((acc, c) => {
        const key = `${c.institute.en}-${c.town.en}`;
        const seen = acc.get(key);
        if (!seen || (!seen.verified && c.verified)) acc.set(key, c);
        return acc;
      }, new Map<string, (typeof classes)[number]>())
      .values(),
  );

  return (
    <section id="contact" className="scroll-mt-24 py-14 sm:scroll-mt-28 sm:py-20">
      <div className="shell">
        <SectionHead
          no="08"
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          sub={t.contact.sub}
        />

        <div className="mt-8 grid gap-7 sm:mt-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* the slip */}
          <Reveal>
            <div className="hard border-2 border-[var(--ink)] bg-[var(--paper)]">
              <div className="flex items-center justify-between gap-3 border-b-2 border-[var(--ink)] bg-[var(--panel)] px-4 py-2.5 sm:px-5 sm:py-3">
                <span className="label text-[var(--mustard)]">
                  {lang === "si" ? "ලියාපදිංචි පත්‍රය" : "Registration slip"}
                </span>
                <span className="label shrink-0 text-[var(--panel-fg)] opacity-60">
                  No. ___
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:gap-6 sm:p-7">
                <label className="grid gap-1">
                  <span className="label text-[var(--ink-soft)]">{t.contact.name}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePh}
                    className="underline-field w-full text-[16px] placeholder:text-[var(--ink-soft)]/45"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="label text-[var(--ink-soft)]">
                    {t.contact.classLabel}
                  </span>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="underline-field w-full text-[16px]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {L(c.title)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="label text-[var(--ink-soft)]">{t.contact.note}</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder={t.contact.notePh}
                    className="underline-field w-full resize-none text-[16px] placeholder:text-[var(--ink-soft)]/45"
                  />
                </label>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press hard-sm inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--green)] px-5 py-3.5 text-[14.5px] font-bold text-[var(--paper)] sm:flex-1 sm:px-6 sm:text-[15px]"
                  >
                    <WhatsAppGlyph className="h-5 w-5 shrink-0" />
                    {t.contact.send}
                  </a>
                  <a
                    href={telLink}
                    className="press hard-sm inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--mustard)] px-5 py-3.5 text-[14.5px] font-semibold text-[var(--on-accent)] sm:px-6 sm:text-[15px]"
                  >
                    ☏ {t.contact.call}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* venues + channels */}
          <div className="grid content-start gap-6">
            <Reveal delay={60}>
              <div className="border-2 border-[var(--ink)] bg-[var(--paper-2)]">
                <h3 className="display border-b-2 border-[var(--ink)] px-4 py-2.5 text-[17px] sm:px-5 sm:py-3 sm:text-[19px]">
                  {t.contact.locationTitle}
                </h3>
                <ul>
                  {venues.map((v, i) => (
                    <li
                      key={`${v.institute.en}-${v.town.en}`}
                      className={`flex items-baseline gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4 ${
                        i > 0 ? "border-t-2 border-dashed border-[var(--ink)]" : ""
                      }`}
                    >
                      <span className="label shrink-0 text-[var(--maroon)]">
                        {v.mode === "online" ? "WEB" : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold sm:text-[14.5px]">
                          {L(v.institute)}
                        </span>
                        <span className="block text-[12.5px] leading-snug text-[var(--ink-soft)] sm:text-[13px]">
                          {L(v.town)} · {L(v.day)} · {L(v.time)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="grid grid-cols-2 border-2 border-[var(--ink)]">
                {[
                  {
                    href: waLink(t.wa.generic),
                    label: t.contact.whatsapp,
                    sub: site.phoneDisplay,
                    mark: "✆",
                  },
                  {
                    href: telLink,
                    label: t.contact.callNow,
                    sub: site.phoneDisplay,
                    mark: "☏",
                  },
                  {
                    href: site.facebook,
                    label: t.contact.facebook,
                    sub: "NextGen ICT",
                    mark: "f",
                  },
                  {
                    href: site.tiktok,
                    label: t.contact.tiktok,
                    sub: `@${site.tiktokHandle}`,
                    mark: "♪",
                  },
                ].map((item, i) => (
                  <li
                    key={item.label}
                    className={`${i % 2 === 0 ? "border-r-2" : ""} ${
                      i < 2 ? "border-b-2" : ""
                    } border-[var(--ink)]`}
                  >
                    <a
                      href={item.href}
                      target={item.href.startsWith("tel:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="block h-full px-4 py-4 transition-colors hover:bg-[var(--mustard)] hover:text-[var(--on-accent)] sm:px-5 sm:py-5"
                    >
                      <span className="display block text-[1.3rem] leading-none text-[var(--maroon)] sm:text-[1.5rem]">
                        {item.mark}
                      </span>
                      <span className="mt-2 block text-[13.5px] font-bold sm:text-[14px]">
                        {item.label}
                      </span>
                      <span className="block break-words text-[12px] text-[var(--ink-soft)] sm:text-[12.5px]">
                        {item.sub}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
