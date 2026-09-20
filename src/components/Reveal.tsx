"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Lifts its children into view the first time they are scrolled to.
 * Short travel and a crisp ease — the design is printed matter, not a slideshow.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{
        duration: 0.5,
        delay: delay / 1000,
        ease: [0.2, 0.8, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
