import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt =
  "NextGen ICT with Subhashana Karunanayake — A/L ICT classes in Sinhala medium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
  The share card in the site's own printed-matter language: paper ground, hard
  ink rules, one maroon block. Latin only — the image renderer ships a Latin
  face, and Sinhala glyphs would come out as empty boxes.
*/
export default async function OpengraphImage() {
  const photo = await readFile(
    join(process.cwd(), "public", "images", "tutor-1.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const ink = "#16130f";
  const paper = "#f4efe4";
  const maroon = "#8e1b2e";
  const mustard = "#e3a11b";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: paper,
          color: ink,
          padding: 48,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            border: `6px solid ${ink}`,
            background: paper,
          }}
        >
          {/* left column — the words */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "44px 40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 58,
                  height: 58,
                  background: maroon,
                  color: paper,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                ICT
              </div>
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                }}
              >
                NextGen ICT
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>
                A/L ICT with
              </div>
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: maroon,
                }}
              >
                {site.tutor.name.en}
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontSize: 27,
                  lineHeight: 1.35,
                  color: "#554c40",
                }}
              >
                Theory · Revision · Paper classes, Sinhala medium
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  background: mustard,
                  border: `3px solid ${ink}`,
                  padding: "10px 18px",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Makandura · Kuliyapitiya
              </div>
              <div style={{ display: "flex", fontSize: 22 }}>
                + Online island-wide
              </div>
            </div>
          </div>

          {/* right column — the portrait, printed to the edge */}
          <div
            style={{
              display: "flex",
              width: 420,
              borderLeft: `6px solid ${ink}`,
            }}
          >
            {/* the image renderer draws plain <img>; next/image has no place here */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc}
              alt=""
              width={420}
              height={522}
              style={{ width: 420, height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
