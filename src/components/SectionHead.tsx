"use client";

import { Reveal } from "./Reveal";

/**
 * Shared section masthead: an index number set against a copper eyebrow,
 * then the headline and an optional standfirst on a comfortable measure.
 */
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
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="num text-[12px] font-semibold text-[var(--ink-3)]">{no}</span>
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden />
        <span className="eyebrow min-w-0 truncate text-[var(--accent)]">{eyebrow}</span>
      </div>
      <h2 className="display mt-3.5 text-[clamp(1.75rem,4.4vw,2.85rem)]">{title}</h2>
      {sub && <p className="lede mt-3 max-w-[56ch]">{sub}</p>}
    </Reveal>
  );
}
