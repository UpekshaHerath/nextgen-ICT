# NextGen ICT with Subhashana — website

Bilingual (සිංහල / English) marketing site for A/L ICT classes by
**Subhashana Karunanayake** — Next.js 16 (App Router), TypeScript, Tailwind v4.

## Design language

Printed matter, not a SaaS landing page: warm paper ground with an SVG grain
overlay, black ink hairlines and 2px frames, solid offset shadows (never blur),
maroon + mustard accents lifted from the hand-lettered Sinhala cover art.
Headlines are set in Abhaya Libre, body in Noto Sans Sinhala / Archivo, data in
IBM Plex Mono. Section furniture is deliberately physical — admission-ticket
class cards with perforations, a ruled noticeboard timetable, a contents-page
syllabus, taped notes for quotes, photo prints tilted on a board, and a paper
registration slip for the contact form. Motion is limited to a short lift on
scroll and a press effect on buttons.

### Motion

Animation runs on **Framer Motion** (the `motion` package, imported from
`motion/react`). The rule of thumb matches the print design: short, crisp,
purposeful — nothing floats or bounces for decoration.

| Where | What |
| --- | --- |
| `ScrollProgress` | Maroon rule across the top, spring-smoothed scroll position |
| `Reveal` | Shared scroll-in (16px lift, fires once) used by every section |
| `Hero` | Staggered load-in, parallax on the portrait, spring sticker, nudging ↓ arrow |
| `StatCounter` | Stats count up from zero when first scrolled into view |
| `Nav` | Bar retracts on scroll-down and returns on scroll-up; `layoutId` underline and language pill slide between positions; animated burger; sheet expands with staggered rows |
| `Classes` | `AnimatePresence` + `layout` so filtering re-flows rather than snapping; cards lift on hover |
| `Gallery` / `Testimonials` | Tilted prints straighten and lift on hover |
| `Faq` | Height-animated accordion, spring-rotated `+` |
| `WhatsAppFab` | Springs in past the hero, presses on tap |

Every one of these checks `useReducedMotion()` (or `viewport.once`), so a visitor
with "reduce motion" set gets the static layout. Scrolling itself stays native —
no scroll-hijacking library — which keeps it smooth on low-end phones.

## Responsive rules

One gutter class, `.shell`, sets every section's width and side padding
(`clamp(1rem, 4vw, 1.5rem)`), so the page never gets closer than 16px to a phone
edge. Breakpoints: `sm` 640 (utility bar, two-up grids), `lg` 1024 (desktop nav,
split layouts). Specific adaptations worth knowing before editing:

- **Hero** — headline always comes first; the portrait is capped at `72vw` on
  phones so it never eats the first screen.
- **Timetable** — stacked day cards below `lg`, the printed table at `lg` and up.
  Both render from the same data; edit `classes[]` only.
- **Class cards** — one column until `lg`; the filter rail scrolls sideways
  instead of wrapping.
- **Form fields** — 16px text, which stops iOS Safari zooming in on focus.
- **Offset shadows** and the ruled-paper pitch shrink under 640px.

Tokens live at the top of `src/app/globals.css` (`--paper`, `--ink`, `--maroon`,
`--mustard`) along with the reusable devices: `.frame`, `.hard`, `.press`,
`.ruled`, `.dots`, `.ticket`, `.tape`, `.underline-field`.

## Run it

```bash
npm install      # already done
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where to edit things

Almost everything lives in **`src/lib/site.ts`** — one file, no component edits needed:

| What | Where in `site.ts` |
| --- | --- |
| Phone / WhatsApp number | `site.phone`, `site.whatsappNumber` (international, no `+`) |
| Facebook / TikTok links | `site.facebook`, `site.tiktok` |
| Classes, institutes, days, times | `classes[]` |
| Stats shown in the hero | `stats[]` |
| Syllabus units | `syllabus[]` |
| "Why us" cards | `whyUs[]` |
| Student / parent quotes | `testimonials[]` |
| FAQ | `faqs[]` |
| Photos | `gallery[]`, `tutorPhoto` |

UI labels (buttons, headings) live in **`src/lib/i18n.ts`**, with a `si` and an `en`
copy of every string. Sinhala is the default; the toggle in the navbar switches
language instantly and remembers the choice in `localStorage`.

### ⚠ Details that still need confirming

Entries in `classes[]` carry a `verified` flag:

- `verified: true` — read off the official Facebook page posters
  (2027 A/L Revision + Paper @ Samadhi, Makandura — Tuesday 9.00 a.m.–2.00 p.m.;
  2026 O/L paper discussion @ Science Center, Kuliyapitiya — 4.00 p.m.–9.00 p.m.).
- `verified: false` — **placeholder**. The Grade 12 theory class and the online
  class need real days, times and venues. Cards for these show
  "confirm details" instead of "join this class" until the flag is flipped.

The Saturday/weekend days assigned to the O/L and Grade 12 classes are guesses —
correct them in `classes[].day`.

### Images in `public/images/`

Captured from the official Facebook page (logged-in session), downscaled to
1400px wide, JPEG q0.88:

| File | Use |
| --- | --- |
| `tutor-1.jpg` | Hero portrait — mic, whiteboard (`tutorPhoto`) |
| `tutor-2.jpg` | Hero inset — mid-lesson, tucked under the main frame |
| `group-batch-full.jpg` | Gallery lead — whole 2026 batch, 16:9 (wide tile) |
| `group-01.jpg` | Gallery — 2026 batch group photo (wide tile) |
| `group-06.jpg` | Gallery — cake moment with sir (wide tile) |
| `group-02/03/08.jpg` | Gallery — student pairs at the 2026 backdrop |
| `group-04/05.jpg` | Spare — more celebration shots |
| `class-01…06.jpg` | Gallery — classroom candids (credit: WEENUZ) |
| `poster-2027-revision.jpg` | Spare — A/L 2027 Revision + Paper poster |
| `poster-2027-revision-samadhi.jpg` | Spare — A/L 2027 Revision, Samadhi |
| `poster-ol-2026.jpg` | Spare — 2026 O/L paper discussion |
| `poster-2026-al-wishes.jpg` | Spare — 2026 A/L good-luck post |
| `logo-signature.jpg` | Spare — his Sinhala calligraphy signature mark |

The gallery is classroom photos only — no posters, by request. The posters stay
on disk as spares and still serve as the source of record for class times.

Gallery tiles crop to 3:4, since every available image is square or taller.

### Adding photos

1. Drop image files into `public/images/` (e.g. `tutor.jpg`, `class-01.jpg`).
2. Set `tutorPhoto = "/images/tutor.jpg"` and add `src: "/images/class-01.jpg"`
   to the matching entry in `gallery[]`.

Anything without a `src` renders as a styled placeholder tile, so the page looks
finished until the real photos arrive. Facebook CDN URLs cannot be hot-linked —
they expire and are blocked — so the files have to be downloaded and committed.

## Structure

```
src/app/layout.tsx     fonts (Noto Sans Sinhala + Outfit + JetBrains Mono), SEO, JSON-LD
src/app/page.tsx       section order
src/app/globals.css    theme tokens, glass/glow surfaces, animations
src/components/        Nav, Hero, About, Classes, Timetable, Syllabus,
                       Gallery, Testimonials, Faq, Contact, Footer, WhatsAppFab
src/lib/site.ts        all content
src/lib/i18n.ts        all UI strings (si / en)
```

## Contact flow

There is no backend. Every call-to-action builds a `wa.me` deep link with a
pre-written Sinhala/English message (student name, chosen class, venue and time),
so an enquiry lands in WhatsApp already filled in. The contact form is purely
client-side — nothing is stored or sent anywhere else.
