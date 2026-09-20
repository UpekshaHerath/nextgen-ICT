import type { MetadataRoute } from "next";
import { seoDescription } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextGen ICT with Subhashana Karunanayake",
    short_name: "NextGen ICT",
    description: seoDescription,
    start_url: "/",
    display: "standalone",
    lang: "si-LK",
    background_color: "#f4efe4",
    theme_color: "#f4efe4",
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
