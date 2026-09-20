import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt =
  "NextGen ICT with Subhashana Karunanayake — A/L ICT classes in Sinhala medium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
  The share card in the site's own language: warm canvas, deep ink type, one
  copper mark. Latin only — the image renderer ships a Latin face, and Sinhala
  glyphs would come out as empty boxes.
*/
export default async function OpengraphImage() {
  const photo = await readFile(
    join(process.cwd(), "public", "images", "tutor-1.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const ink = "#14181d";
  const canvas = "#fbfaf7";
  const surface = "#ffffff";
  const accent = "#9c5a2a";
  const line = "#e6e2da";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: canvas,
          color: ink,
          padding: 56,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            border: `1px solid ${line}`,
            borderRadius: 20,
            overflow: "hidden",
            background: surface,
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
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: accent,
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                ICT
              </div>
              <div
                style={{
                  fontSize: 20,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  color: "#4b525b",
                }}
              >
                NextGen ICT
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.08 }}>
                A/L ICT with
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  lineHeight: 1.12,
                  color: accent,
                }}
              >
                {site.tutor.name.en}
              </div>
              <div
                style={{
                  marginTop: 22,
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: "#4b525b",
                }}
              >
                Theory · Revision · Paper classes, Sinhala medium
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  background: "#f7efe6",
                  border: `1px solid #e8d7c4`,
                  borderRadius: 999,
                  padding: "10px 20px",
                  fontSize: 21,
                  fontWeight: 600,
                  color: accent,
                }}
              >
                Makandura · Kuliyapitiya
              </div>
              <div style={{ display: "flex", fontSize: 21, color: "#4b525b" }}>
                + Online island-wide
              </div>
            </div>
          </div>

          {/* right column — the portrait, printed to the edge */}
          <div
            style={{
              display: "flex",
              width: 420,
              borderLeft: `1px solid ${line}`,
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
