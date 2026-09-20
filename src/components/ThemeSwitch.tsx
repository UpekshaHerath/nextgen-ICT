"use client";

import { motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { useTheme, type Resolved } from "./ThemeProvider";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="2" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 1.6v2.6M12 19.8v2.6M1.6 12h2.6M19.8 12h2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M19.4 4.6l-1.9 1.9M6.5 17.5l-1.9 1.9" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none">
      <path
        d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.7 8.7 0 1 0 10.8 10.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MODES: { key: Resolved; Icon: () => React.JSX.Element }[] = [
  { key: "light", Icon: SunIcon },
  { key: "dark", Icon: MoonIcon },
];

/**
 * Sun / moon pair, cut from the same block as the language switch. The bar
 * mounts one of these per breakpoint, so each needs its own `pillId` — two
 * instances sharing one layoutId hand the pill to whichever copy is hidden.
 */
export function ThemeSwitch({
  className = "",
  pillId = "theme-pill",
}: {
  className?: string;
  pillId?: string;
}) {
  const { t } = useLang();
  const { resolved, setTheme } = useTheme();

  return (
    <div
      className={`flex border border-[var(--ink)] ${className}`}
      role="group"
      aria-label={t.common.themeLabel}
    >
      {MODES.map(({ key, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setTheme(key)}
          aria-pressed={resolved === key}
          aria-label={key === "light" ? t.common.themeLight : t.common.themeDark}
          title={key === "light" ? t.common.themeLight : t.common.themeDark}
          className={`relative grid h-[30px] w-9 place-items-center transition-colors ${
            resolved === key
              ? "text-[var(--panel-fg)]"
              : "text-[var(--ink)] hover:bg-[var(--mustard)] hover:text-[var(--on-accent)]"
          }`}
        >
          {resolved === key && (
            <motion.span
              layoutId={pillId}
              className="absolute inset-0 bg-[var(--panel)]"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10 flex">
            <Icon />
          </span>
        </button>
      ))}
    </div>
  );
}
