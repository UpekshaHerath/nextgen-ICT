"use client";

import { Reveal } from "./Reveal";

/** Shared section masthead: eyebrow pill, headline, optional lede. */
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
      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] py-1 pl-1 pr-3 shadow-[var(--shadow-sm)]">
        <span className="label shrink-0 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] text-[var(--on-brand)]">
          {no}
        </span>
        <span className="label min-w-0 truncate text-[var(--brand)]">{eyebrow}</span>
      </span>
      <h2 className="display mt-4 text-[clamp(1.8rem,5.2vw,3.2rem)] sm:mt-5">{title}</h2>
      {sub && (
        <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-[var(--muted)] sm:text-[16px]">
          {sub}
        </p>
      )}
    </Reveal>
  );
}
