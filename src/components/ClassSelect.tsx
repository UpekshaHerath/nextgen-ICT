"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import type { ClassInfo } from "@/lib/site";

/**
 * Class picker for the registration form. A native <select> opens an
 * OS-drawn list that cannot be styled, so this is a listbox of our own:
 * rounded panel, batch colour per row, and the usual keyboard contract
 * (arrows / Home / End move, Enter or Space picks, Escape or Tab closes).
 */
export function ClassSelect({
  options,
  value,
  onChange,
  labelId,
}: {
  options: ClassInfo[];
  value: string;
  onChange: (id: string) => void;
  labelId: string;
}) {
  const { L } = useLang();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = Math.max(
    0,
    options.findIndex((c) => c.id === value),
  );
  const selected = options[selectedIndex];

  // close on a click anywhere outside the picker
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // keep the highlighted row in view while arrowing through a long list
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => {
    setActive(selectedIndex);
    setOpen(true);
    requestAnimationFrame(() => listRef.current?.focus());
  };

  const pick = (i: number) => {
    onChange(options[i].id);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      " ": () => pick(active),
      Escape: () => {
        setOpen(false);
        buttonRef.current?.focus();
      },
    };
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      move();
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onButtonKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        className={`flex w-full items-center gap-3 rounded-xl border bg-[var(--bg)] px-3.5 py-3 text-left transition-[border-color,box-shadow] duration-200 ${
          open
            ? "border-[var(--brand)] shadow-[0_0_0_4px_var(--field-focus)]"
            : "border-[var(--line-strong)] hover:border-[color-mix(in_srgb,var(--brand)_50%,var(--line-strong))]"
        }`}
      >
        <Dot c={selected} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold leading-tight">
            {L(selected.title)}
          </span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--muted)]">
            {L(selected.day)} · {L(selected.time)} · {L(selected.town)}
          </span>
        </span>
        <motion.svg
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-[var(--muted)]"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          aria-hidden
        >
          <path
            d="M5 7.5l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={`${listId}-${active}`}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.3, 1] }}
            className="thin-scroll absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[320px] origin-top overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-lg)] outline-none"
          >
            {options.map((c, i) => {
              const isSelected = c.id === value;
              return (
                <li
                  key={c.id}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => pick(i)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    i === active ? "bg-[var(--bg-soft)]" : ""
                  }`}
                >
                  <Dot c={c} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[14px] leading-tight ${
                        isSelected ? "font-bold text-[var(--brand)]" : "font-semibold"
                      }`}
                    >
                      {L(c.title)}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[var(--muted)]">
                      {L(c.day)} · {L(c.time)} · {L(c.institute)}, {L(c.town)}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-[var(--on-brand)]">
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dot({ c }: { c: ClassInfo }) {
  return (
    <span
      aria-hidden
      className="h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: `var(--batch-${c.batch.id})` }}
    />
  );
}
