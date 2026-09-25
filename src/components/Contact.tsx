"use client";

import { useId, useMemo, useState } from "react";
import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { WhatsAppGlyph } from "./Hero";
import { ClassSelect } from "./ClassSelect";
import { ChannelBadge, PhoneGlyph, type Channel } from "./BrandIcons";
import { classes, site, telLink, venues, waLink } from "@/lib/site";

/** Registration form — fills a WhatsApp message instead of a database. */
export function Contact() {
  const { t, L, lang } = useLang();
  const [name, setName] = useState("");
  const [classId, setClassId] = useState(classes[0].id);
  const [note, setNote] = useState("");
  const classLabelId = useId();

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

  // one row per venue, listing the batches and days held there
  const venueRows = venues.map((v) => {
    const list = classes.filter((c) => c.venue.id === v.id);
    return {
      v,
      batchNames: [...new Set(list.map((c) => L(c.batch.name)))].join(", "),
      dayNames: [...new Set(list.map((c) => L(c.day)))].join(", "),
    };
  });

  return (
    <section id="contact" className="relative isolate overflow-hidden py-16 sm:py-24">
      <div className="shell">
        <SectionHead
          no="08"
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          sub={t.contact.sub}
        />

        <div className="mt-8 grid gap-7 sm:mt-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* the form */}
          <Reveal>
            <div className="card rounded-3xl shadow-[var(--shadow-lg)]">
              <div className="flex items-center gap-3 rounded-t-3xl border-b border-[var(--line)] bg-[var(--bg-soft)] px-5 py-4 sm:px-7">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                <span className="text-[14px] font-semibold">
                  {lang === "si" ? "ලියාපදිංචි පත්‍රය" : "Registration form"}
                </span>
              </div>

              <div className="grid gap-5 p-5 sm:gap-6 sm:p-7">
                <label className="grid gap-1.5">
                  <span className="text-[13px] font-semibold">{t.contact.name}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePh}
                    className="underline-field w-full text-[16px] placeholder:text-[var(--muted)]/60"
                  />
                </label>

                <div className="grid gap-1.5">
                  <span id={classLabelId} className="text-[13px] font-semibold">
                    {t.contact.classLabel}
                  </span>
                  <ClassSelect
                    options={classes}
                    value={classId}
                    onChange={setClassId}
                    labelId={classLabelId}
                  />
                </div>

                <label className="grid gap-1.5">
                  <span className="text-[13px] font-semibold">{t.contact.note}</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder={t.contact.notePh}
                    className="underline-field w-full resize-none text-[16px] placeholder:text-[var(--muted)]/60"
                  />
                </label>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[14.5px] font-semibold sm:flex-1 sm:px-6 sm:text-[15px]"
                  >
                    <WhatsAppGlyph className="h-5 w-5 shrink-0" />
                    {t.contact.send}
                  </a>
                  <a
                    href={telLink}
                    className="press btn-ghost inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[14.5px] font-semibold sm:px-6 sm:text-[15px]"
                  >
                    <PhoneGlyph className="h-[18px] w-[18px] shrink-0" />
                    {t.contact.call}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* venues + channels */}
          <div className="grid content-start gap-6">
            <Reveal delay={60}>
              <div className="card overflow-hidden rounded-3xl">
                <h3 className="display border-b border-[var(--line)] px-5 py-4 text-[17px] sm:text-[19px]">
                  {t.contact.locationTitle}
                </h3>
                <ul>
                  {venueRows.map(({ v, batchNames, dayNames }, i) => (
                    <li
                      key={v.id}
                      className={`flex items-start gap-3 px-5 py-4 sm:gap-4 ${
                        i > 0 ? "border-t border-[var(--line)]" : ""
                      }`}
                    >
                      <span className="display grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-[12px] text-[var(--brand)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-bold sm:text-[14.5px]">
                          {L(v.institute)}
                        </span>
                        <span className="block text-[12.5px] leading-snug text-[var(--muted)] sm:text-[13px]">
                          {L(v.town)} · {batchNames}
                          <br />
                          {dayNames}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={110}>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                {(
                  [
                  {
                    href: waLink(t.wa.generic),
                    label: t.contact.whatsapp,
                    sub: site.phoneDisplay,
                    channel: "whatsapp",
                  },
                  {
                    href: telLink,
                    label: t.contact.callNow,
                    sub: site.phoneDisplay,
                    channel: "phone",
                  },
                  {
                    href: site.facebook,
                    label: t.contact.facebook,
                    sub: "NextGen ICT",
                    channel: "facebook",
                  },
                  {
                    href: site.tiktok,
                    label: t.contact.tiktok,
                    sub: `@${site.tiktokHandle}`,
                    channel: "tiktok",
                  },
                  ] satisfies { href: string; label: string; sub: string; channel: Channel }[]
                ).map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("tel:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="press group flex h-full flex-col items-center justify-center rounded-3xl border border-[var(--line)] bg-[var(--surface)] px-3 py-5 text-center shadow-[var(--shadow-sm)] hover:border-[var(--line-strong)] sm:px-4 sm:py-6"
                    >
                      <ChannelBadge
                        channel={item.channel}
                        className="h-12 w-12 !rounded-2xl transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-14 sm:w-14"
                      />
                      <span className="mt-3 block text-[13.5px] font-bold leading-snug sm:text-[14.5px]">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block max-w-full break-words text-[12px] text-[var(--muted)] sm:text-[12.5px]">
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
