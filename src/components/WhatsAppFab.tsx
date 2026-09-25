"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "./LanguageProvider";
import { WhatsAppGlyph } from "./Hero";
import { waLink } from "@/lib/site";

/** Floating WhatsApp button - appears once the hero is scrolled past. */
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
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="btn-whatsapp fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full px-4 py-3 font-semibold"
        >
          <WhatsAppGlyph className="h-6 w-6" />
          <span className="hidden text-[14px] sm:inline">{t.common.whatsapp}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
