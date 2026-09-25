"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The NextGen ICT lockup, set on a softly tinted pill: a maroon disc holding an "N" with a blinking
 * terminal cursor, beside the wordmark. `onDark` lifts the accent for the
 * footer, which stays a dark slab in both themes.
 */
export function BrandMark({
  size = "md",
  onDark = false,
}: {
  size?: "md" | "lg";
  onDark?: boolean;
}) {
  const reduce = useReducedMotion();
  const lg = size === "lg";

  return (
    <span
      className={`group flex w-fit min-w-0 max-w-full items-center gap-2.5 rounded-full border py-1 pl-1 pr-4 transition-colors sm:gap-3 sm:pr-5 ${
        onDark
          ? "border-white/10 bg-white/[0.06]"
          : "border-[color-mix(in_srgb,var(--brand)_14%,transparent)] bg-[color-mix(in_srgb,var(--brand)_7%,var(--bg))] hover:bg-[color-mix(in_srgb,var(--brand)_11%,var(--bg))]"
      }`}
    >
      <motion.span
        aria-hidden
        whileHover={reduce ? undefined : { y: -1, rotate: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={`relative grid shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[var(--on-brand)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),var(--shadow-sm)] ${
          lg ? "h-11 w-11" : "h-9 w-9 sm:h-10 sm:w-10"
        }`}
      >
        {/* hairline inner frame for a crafted, stamped feel */}
        <span className="absolute inset-[3px] rounded-full border border-white/15" />
        <span
          className={`relative font-[family-name:var(--font-display)] font-extrabold leading-none tracking-[-0.04em] ${
            lg ? "text-[21px]" : "text-[18px] sm:text-[19px]"
          }`}
        >
          N
        </span>
        <span className="brand-cursor absolute bottom-[10px] right-[9px] h-[2px] w-[6px] rounded-full bg-current" />
      </motion.span>

      <span className="min-w-0 leading-none">
        <span
          className={`block truncate font-[family-name:var(--font-display)] font-extrabold tracking-[-0.02em] ${
            lg ? "text-[21px]" : "text-[16.5px] sm:text-[18px]"
          }`}
        >
          NextGen{" "}
          <span className={onDark ? "text-[#e9909d]" : "text-[var(--brand)]"}>ICT</span>
        </span>
        <span
          className={`mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.16em] ${
            onDark ? "opacity-60" : "text-[var(--muted)]"
          }`}
        >
          with Subhashana
        </span>
      </span>
    </span>
  );
}
