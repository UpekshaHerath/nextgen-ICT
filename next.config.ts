import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder is not a git repo, so pin the workspace root here to stop
  // Turbopack walking up and picking up an unrelated lockfile.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
