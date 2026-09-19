import type { NextConfig } from "next";

// Photographs uploaded from the dashboard are served from the R2 bucket's own
// domain. Reading it from the environment keeps next.config and .env in step,
// and an unset value simply means no remote images are allowed.
const publicStorage = process.env.R2_PUBLIC_URL;

const nextConfig: NextConfig = {
  // The theme toggle owns the bottom-left corner.
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: publicStorage ? [new URL(`${publicStorage.replace(/\/$/, "")}/**`)] : [],
  },
};

export default nextConfig;
