"use client";

import { Reveal } from "./Reveal";

/** Shared section masthead: printed index number, rule, headline. */
export function SectionHead({
  no,
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  no: string;
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      <div
        className={`flex items-center gap-2.5 sm:gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="label shrink-0 bg-[var(--panel)] px-2 py-1 text-[var(--panel-fg)]">
          {no}
        </span>
        <span className="label min-w-0 truncate text-[var(--maroon)]">{eyebrow}</span>
        <span className="h-px flex-1 bg-[var(--ink)] opacity-30" />
      </div>
      <h2 className="display mt-3 text-[clamp(1.75rem,5.6vw,3.6rem)] sm:mt-4">{title}</h2>
      {sub && (
        <p className="mt-2.5 max-w-[58ch] text-[14px] text-[var(--ink-soft)] sm:mt-3 sm:text-[15px]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}
