"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Counts a stat up to its value the first time it scrolls into view.
 * Values carry suffixes ("1000+", "100%"), so only the leading number animates.
 */
export function StatCounter({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  const parsed = value.match(/^(\d+)(.*)$/);
  const target = parsed ? Number(parsed[1]) : 0;
  const suffix = parsed ? parsed[2] : "";
  const animatable = Boolean(parsed) && !reduce;

  const [n, setN] = useState(animatable ? 0 : target);

  useEffect(() => {
    if (!inView || !animatable) return;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.2, 0.8, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, animatable, target]);

  return (
    <span ref={ref} className={className}>
      {parsed ? `${n}${suffix}` : value}
    </span>
  );
}
