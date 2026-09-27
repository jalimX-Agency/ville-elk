import type { NextConfig } from "next";
import { PUBLIC_STORAGE_URL } from "./src/lib/storage/public-url";

const nextConfig: NextConfig = {
  // The theme toggle owns the bottom-left corner.
  devIndicators: { position: "bottom-right" },
  images: {
    // Photographs uploaded from the dashboard are served from the R2 bucket's
    // own domain; nothing else may be optimised through this site.
    remotePatterns: [new URL(`${PUBLIC_STORAGE_URL}/**`)],
    // 75 for thumbnails; 85 for the photographs a visitor looks at full-screen,
    // which arrive already compressed once by WhatsApp and show every step more.
    qualities: [75, 85],
  },
};

export default nextConfig;
