"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { WhatsAppGlyph } from "./Hero";
import { waLink } from "@/lib/site";

/** Floating WhatsApp button — appears once the hero is scrolled past. */
export function WhatsAppFab() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="fab"
          href={waLink(t.wa.generic)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.common.whatsapp}
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[var(--green)] px-4 py-3.5 font-semibold text-white shadow-[var(--shadow-lg)]"
        >
          <WhatsAppGlyph className="h-5 w-5" />
          <span className="hidden text-[14px] sm:inline">{t.common.whatsapp}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
