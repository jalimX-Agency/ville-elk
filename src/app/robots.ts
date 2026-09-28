import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/fiche/"] },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Bingbot", "Googlebot"], allow: "/" },
    ],
    sitemap: "https://www.villaelk.com/sitemap.xml",
  };
}
