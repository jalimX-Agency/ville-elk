import type { MetadataRoute } from "next";

const PRIVATE = ["/admin/", "/api/", "/fiche/"];

/**
 * Search engines and AI assistants are all welcome — being quoted by them is
 * how travellers find the villa now. A named crawler follows only its own
 * group, so each group repeats what stays private.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "Googlebot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://www.villaelk.com/sitemap.xml",
    host: "https://www.villaelk.com",
  };
}
