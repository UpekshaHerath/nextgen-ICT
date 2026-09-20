/**
 * Canonical origin of the deployed site, used by metadata, robots and sitemap.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL   — set this once the custom domain is live.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel sets this on every deployment,
 *      so preview and production builds get a correct absolute URL for free.
 *   3. localhost, for `next dev`.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolve();
