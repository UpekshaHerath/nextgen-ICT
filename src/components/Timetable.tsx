"use client";

import { useLang } from "./LanguageProvider";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { classes, type ClassInfo } from "@/lib/site";

/** Weekday columns, matched against each class's `day` field. */
const DAYS: { si: string; en: string; match: string[] }[] = [
  { si: "සඳුදා", en: "Monday", match: ["සඳුදා", "Monday"] },
  { si: "අඟහරුවාදා", en: "Tuesday", match: ["අඟහරුවාදා", "Tuesday"] },
  { si: "බදාදා", en: "Wednesday", match: ["බදාදා", "Wednesday"] },
  { si: "බ්‍රහස්පතින්දා", en: "Thursday", match: ["බ්‍රහස්පතින්දා", "Thursday"] },
  { si: "සිකුරාදා", en: "Friday", match: ["සිකුරාදා", "Friday"] },
  {
    si: "සෙනසුරාදා",
    en: "Saturday",
    match: ["සෙනසුරාදා", "Saturday", "සති අන්තයේ", "Weekend"],
  },
  { si: "ඉරිදා", en: "Sunday", match: ["ඉරිදා", "Sunday", "සති අන්තයේ", "Weekend"] },
];

function classesOn(day: (typeof DAYS)[number]) {
  return classes.filter((c) => day.match.some((m) => c.day.si === m || c.day.en === m));
}

export function Timetable() {
  const { t, L, lang } = useLang();
  const week = DAYS.map((d) => ({ day: d, list: classesOn(d) }));
  const freeDays = week.filter((w) => w.list.length === 0);

  return (
    <section
      id="timetable"
      className="scroll-mt-24 border-b-2 border-[var(--ink)] py-14 sm:scroll-mt-28 sm:py-20"
    >
      <div className="shell">
        <SectionHead
          no="03"
          eyebrow={t.timetable.eyebrow}
          title={t.timetable.title}
          sub={t.timetable.sub}
        />

        {/* phones + tablets: one block per day that actually has a class */}
        <ul className="mt-7 grid gap-4 lg:hidden">
          {week
            .filter((w) => w.list.length > 0)
            .map(({ day, list }) => (
              <Reveal as="li" key={day.en}>
                <div className="border-2 border-[var(--ink)] bg-[var(--paper-2)]">
                  <p className="display border-b-2 border-[var(--ink)] bg-[var(--panel)] px-4 py-2.5 text-[16px] text-[var(--mustard)]">
                    {lang === "si" ? day.si : day.en}
                  </p>
                  <ul>
                    {list.map((c, i) => (
                      <li
                        key={c.id}
                        className={`px-4 py-4 ${
                          i > 0 ? "border-t-2 border-dashed border-[var(--ink)]" : ""
                        }`}
                      >
                        <DayEntry c={c} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

          {freeDays.length > 0 && (
            <Reveal as="li">
              <p className="border-2 border-dashed border-[var(--ink)]/50 px-4 py-3 text-[13px] text-[var(--ink-soft)]">
                {t.timetable.noClass}:{" "}
                {freeDays.map((w) => (lang === "si" ? w.day.si : w.day.en)).join(", ")}
              </p>
            </Reveal>
          )}
        </ul>

        {/* laptops and up: the printed noticeboard table */}
        <Reveal className="thin-scroll mt-8 hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[760px] border-collapse border-2 border-[var(--ink)] text-left">
            <thead>
              <tr className="bg-[var(--panel)] text-[var(--panel-fg)]">
                <th className="label w-[18%] px-4 py-3">
                  {lang === "si" ? "දිනය" : "Day"}
                </th>
                <th className="label px-4 py-3">{lang === "si" ? "පන්තිය" : "Class"}</th>
                <th className="label w-[24%] px-4 py-3">
                  {lang === "si" ? "ස්ථානය" : "Venue"}
                </th>
                <th className="label w-[20%] px-4 py-3">
                  {lang === "si" ? "වේලාව" : "Time"}
                </th>
              </tr>
            </thead>
            <tbody>
              {week.map(({ day, list }, i) => {
                const empty = list.length === 0;
                return (
                  <tr
                    key={day.en}
                    className={`border-t-2 border-[var(--ink)] align-top ${
                      empty ? "opacity-45" : i % 2 ? "bg-[var(--paper-2)]" : ""
                    }`}
                  >
                    <th
                      scope="row"
                      className="border-r-2 border-[var(--ink)] px-4 py-4 text-[14px] font-bold"
                    >
                      {lang === "si" ? day.si : day.en}
                    </th>

                    {empty ? (
                      <td colSpan={3} className="px-4 py-4 text-[13.5px] italic">
                        - {t.timetable.noClass} -
                      </td>
                    ) : (
                      <>
                        <td className="px-4 py-4">
                          {list.map((c) => (
                            <p
                              key={c.id}
                              className="text-[14px] font-semibold leading-snug"
                            >
                              <span className="label mr-2 text-[var(--maroon)]">
                                {L(c.kind)}
                              </span>
                              {L(c.title)}
                            </p>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-[13.5px]">
                          {list.map((c) => (
                            <p key={c.id} className="leading-snug">
                              {L(c.institute)}
                              <br />
                              <span className="text-[var(--ink-soft)]">{L(c.town)}</span>
                            </p>
                          ))}
                        </td>
                        <td className="px-4 py-4 font-[family-name:var(--font-mono)] text-[13px]">
                          {list.map((c) => (
                            <p
                              key={c.id}
                              className={c.verified ? "" : "text-[var(--maroon)]"}
                            >
                              {L(c.time)}
                            </p>
                          ))}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

function DayEntry({ c }: { c: ClassInfo }) {
  const { L } = useLang();
  return (
    <>
      <p className="label text-[var(--maroon)]">{L(c.kind)}</p>
      <p className="mt-1 text-[14.5px] font-bold leading-snug">{L(c.title)}</p>
      <dl className="mt-2 grid gap-1 text-[13px]">
        <div className="flex gap-2">
          <dt className="shrink-0 text-[var(--ink-soft)]">▣</dt>
          <dd>
            {L(c.institute)} - {L(c.town)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-[var(--ink-soft)]">◷</dt>
          <dd
            className={`font-[family-name:var(--font-mono)] ${
              c.verified ? "" : "text-[var(--maroon)]"
            }`}
          >
            {L(c.time)}
          </dd>
        </div>
      </dl>
    </>
  );
}
