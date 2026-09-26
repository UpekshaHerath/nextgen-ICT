/*
  Builds the static share card (src/app/opengraph-image.jpg + twitter-image.jpg): the tutor cut-out
  centred on a plain brand-maroon ground. Centred because WhatsApp crops the
  small link preview to a square from the middle. JPEG keeps it well under
  WhatsApp's ~300 KB preview limit.

  Run: node scripts/generate-og-image.mjs
*/
import { copyFile } from "node:fs/promises";
import sharp from "sharp";

const W = 1200;
const H = 630;
const background = "#8e1b2e";

const photoHeight = 760; // taller than the card: crop at the waist, not the head
const photo = await sharp("public/images/tutor-hero.png")
  .resize({ height: photoHeight })
  .toBuffer({ resolveWithObject: true });

const top = 36;
const visible = await sharp(photo.data)
  .extract({ left: 0, top: 0, width: photo.info.width, height: H - top })
  .toBuffer();

await sharp({ create: { width: W, height: H, channels: 3, background } })
  .composite([
    { input: visible, left: Math.round((W - photo.info.width) / 2), top },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("src/app/opengraph-image.jpg");

// X renders the same card; one image, two conventions.
await copyFile("src/app/opengraph-image.jpg", "src/app/twitter-image.jpg");

console.log("wrote src/app/opengraph-image.jpg and twitter-image.jpg");
