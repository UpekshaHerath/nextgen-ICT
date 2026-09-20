"use client";

import { useMemo, useState } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import { classes, site, telLink, waLink } from "@/lib/site";

/** Enrolment form — composes a WhatsApp message instead of hitting a database. */
export function Contact() {
  const { t, L } = useLang();
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
    <section id="contact" className="scroll-mt-24 py-20 sm:scroll-mt-28 sm:py-28">
      <div className="shell">
        <SectionHead
          no="08"
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          sub={t.contact.sub}
        />

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* the form */}
          <Reveal>
            <div className="card p-6 sm:p-8">
              <div className="grid gap-5">
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-medium text-[var(--ink-2)]">
                    {t.contact.name}
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePh}
                    className="field"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[13px] font-medium text-[var(--ink-2)]">
                    {t.contact.classLabel}
                  </span>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="field"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {L(c.title)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[13px] font-medium text-[var(--ink-2)]">
                    {t.contact.note}
                  </span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder={t.contact.notePh}
                    className="field resize-none"
                  />
                </label>

                <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary sm:flex-1"
                  >
                    <WhatsAppGlyph className="h-[18px] w-[18px] shrink-0" />
                    {t.contact.send}
                  </a>
                  <a href={telLink} className="btn btn-ghost">
                    {t.contact.call}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* venues + channels */}
          <div className="grid content-start gap-6">
            <Reveal delay={60}>
              <div className="card overflow-hidden">
                <h3 className="border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-3.5 text-[14px] font-semibold sm:px-6">
                  {t.contact.locationTitle}
                </h3>
                <ul>
                  {venues.map((v, i) => (
                    <li
                      key={`${v.institute.en}-${v.town.en}`}
                      className={`flex items-baseline gap-4 px-5 py-4 sm:px-6 ${
                        i > 0 ? "border-t border-[var(--line)]" : ""
                      }`}
                    >
                      <span className="num shrink-0 text-[12px] text-[var(--ink-3)]">
                        {v.mode === "online" ? "web" : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-semibold">
                          {L(v.institute)}
                        </span>
                        <span className="block text-[13px] leading-snug text-[var(--ink-3)]">
                          {L(v.town)} · {L(v.day)} · {L(v.time)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    href: waLink(t.wa.generic),
                    label: t.contact.whatsapp,
                    sub: site.phoneDisplay,
                  },
                  { href: telLink, label: t.contact.callNow, sub: site.phoneDisplay },
                  { href: site.facebook, label: t.contact.facebook, sub: "NextGen ICT" },
                  {
                    href: site.tiktok,
                    label: t.contact.tiktok,
                    sub: `@${site.tiktokHandle}`,
                  },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("tel:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="card card-lift group flex h-full items-center justify-between gap-3 px-5 py-4"
                    >
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold">
                          {item.label}
                        </span>
                        <span className="block break-words text-[12.5px] text-[var(--ink-3)]">
                          {item.sub}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-[var(--ink-3)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                        aria-hidden
                      >
                        →
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
