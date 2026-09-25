import { WhatsAppGlyph } from "./Hero";

type IconProps = { className?: string };

/** Facebook "f" mark. */
export function FacebookGlyph({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 320 512" fill="currentColor" className={className} aria-hidden>
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

const TIKTOK_PATH =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

/** TikTok note. `duotone` adds the brand's cyan/red offset layers. */
export function TikTokGlyph({ className = "", duotone = false }: IconProps & { duotone?: boolean }) {
  return (
    <svg viewBox="-1 -1 26 26" fill="currentColor" className={className} aria-hidden>
      {duotone && (
        <>
          <path d={TIKTOK_PATH} fill="#25F4EE" transform="translate(-0.7 -0.7)" />
          <path d={TIKTOK_PATH} fill="#FE2C55" transform="translate(0.7 0.7)" />
        </>
      )}
      <path d={TIKTOK_PATH} />
    </svg>
  );
}

/** Telephone handset. */
export function PhoneGlyph({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

/** Map pin. */
export function PinGlyph({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export type Channel = "whatsapp" | "phone" | "facebook" | "tiktok";

const BADGE: Record<Channel, string> = {
  whatsapp: "bg-[#25D366]",
  phone: "bg-[#0A84FF]",
  facebook: "bg-[#1877F2]",
  tiktok: "bg-[#010101]",
};

/** Colour used to tint a channel's card. TikTok uses its pink, as black would vanish in dark mode. */
export const CHANNEL_TINT: Record<Channel, string> = {
  whatsapp: "#25D366",
  phone: "#0A84FF",
  facebook: "#1877F2",
  tiktok: "#FE2C55",
};

/** Rounded app-style badge in the channel's real brand colour. */
export function ChannelBadge({ channel, className = "" }: { channel: Channel; className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)] ${BADGE[channel]} ${className}`}
    >
      {channel === "whatsapp" && <WhatsAppGlyph className="h-[58%] w-[58%]" />}
      {channel === "phone" && <PhoneGlyph className="h-[52%] w-[52%]" />}
      {channel === "facebook" && <FacebookGlyph className="h-[56%] w-[56%]" />}
      {channel === "tiktok" && <TikTokGlyph duotone className="h-[56%] w-[56%]" />}
    </span>
  );
}
