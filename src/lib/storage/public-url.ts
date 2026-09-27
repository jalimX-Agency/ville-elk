/**
 * Where uploaded photographs are served from. R2_PUBLIC_URL overrides it, but
 * the site must never depend on that variable being set: when it was missing on
 * Vercel, the image optimizer refused every gallery photograph.
 */
export const PUBLIC_STORAGE_URL = (process.env.R2_PUBLIC_URL?.trim() || "https://cdn.villaelk.com").replace(/\/$/, "");
