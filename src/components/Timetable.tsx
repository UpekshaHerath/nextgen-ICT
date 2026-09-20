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
    <section id="timetable" className="scroll-mt-24 py-20 sm:scroll-mt-28 sm:py-28">
      <div className="shell">
        <SectionHead
          no="03"
          eyebrow={t.timetable.eyebrow}
          title={t.timetable.title}
          sub={t.timetable.sub}
        />

        {/* phones + tablets: one block per day that actually has a class */}
        <ul className="mt-9 grid gap-4 lg:hidden">
          {week
            .filter((w) => w.list.length > 0)
            .map(({ day, list }) => (
              <Reveal as="li" key={day.en}>
                <div className="card overflow-hidden">
                  <p className="border-b border-[var(--line)] bg-[var(--surface-2)] px-5 py-3 text-[14px] font-semibold">
                    {lang === "si" ? day.si : day.en}
                  </p>
                  <ul>
                    {list.map((c, i) => (
                      <li
                        key={c.id}
                        className={`px-5 py-4 ${
                          i > 0 ? "border-t border-[var(--line)]" : ""
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
              <p className="rounded-[var(--r)] border border-dashed border-[var(--line-strong)] px-5 py-3.5 text-[13px] text-[var(--ink-3)]">
                {t.timetable.noClass}:{" "}
                {freeDays.map((w) => (lang === "si" ? w.day.si : w.day.en)).join(", ")}
              </p>
            </Reveal>
          )}
        </ul>

        {/* laptops and up: the full week as one table */}
        <Reveal className="thin-scroll mt-10 hidden overflow-x-auto lg:block">
          <div className="card overflow-hidden">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-[var(--surface-2)]">
                  <th className="eyebrow w-[18%] px-5 py-3.5 text-[var(--ink-3)]">
                    {lang === "si" ? "දිනය" : "Day"}
                  </th>
                  <th className="eyebrow px-5 py-3.5 text-[var(--ink-3)]">
                    {lang === "si" ? "පන්තිය" : "Class"}
                  </th>
                  <th className="eyebrow w-[24%] px-5 py-3.5 text-[var(--ink-3)]">
                    {lang === "si" ? "ස්ථානය" : "Venue"}
                  </th>
                  <th className="eyebrow w-[18%] px-5 py-3.5 text-[var(--ink-3)]">
                    {lang === "si" ? "වේලාව" : "Time"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {week.map(({ day, list }) => {
                  const empty = list.length === 0;
                  return (
                    <tr
                      key={day.en}
                      className={`border-t border-[var(--line)] align-top transition-colors ${
                        empty ? "text-[var(--ink-3)]" : "hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-[14px] font-semibold text-[var(--ink)]"
                      >
                        {lang === "si" ? day.si : day.en}
                      </th>

                      {empty ? (
                        <td colSpan={3} className="px-5 py-4 text-[13.5px]">
                          {t.timetable.noClass}
                        </td>
                      ) : (
                        <>
                          <td className="px-5 py-4">
                            {list.map((c) => (
                              <p key={c.id} className="text-[14px] leading-snug">
                                <span className="font-semibold">{L(c.title)}</span>
                                <span className="ml-2 text-[12.5px] text-[var(--accent)]">
                                  {L(c.kind)}
                                </span>
                              </p>
                            ))}
                          </td>
                          <td className="px-5 py-4 text-[13.5px]">
                            {list.map((c) => (
                              <p key={c.id} className="leading-snug">
                                {L(c.institute)}
                                <br />
                                <span className="text-[var(--ink-3)]">{L(c.town)}</span>
                              </p>
                            ))}
                          </td>
                          <td className="num px-5 py-4 text-[13px]">
                            {list.map((c) => (
                              <p
                                key={c.id}
                                className={c.verified ? "" : "text-[var(--accent)]"}
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DayEntry({ c }: { c: ClassInfo }) {
  const { L } = useLang();
  return (
    <>
      <p className="eyebrow text-[var(--accent)]">{L(c.kind)}</p>
      <p className="mt-1.5 text-[14.5px] font-semibold leading-snug">{L(c.title)}</p>
      <p className="mt-1.5 text-[13px] text-[var(--ink-2)]">
        {L(c.institute)} — {L(c.town)}
      </p>
      <p
        className={`num mt-0.5 text-[13px] ${
          c.verified ? "text-[var(--ink-3)]" : "text-[var(--accent)]"
        }`}
      >
        {L(c.time)}
      </p>
    </>
  );
}
