/**
 * Where the villa is, from its Google Maps listing (Plus Code HXFX+F99,
 * Marrakech). Directions to nearby places start here, and search engines get
 * the exact point.
 */
export const VILLA_LOCATION = {
  latitude: 31.573663,
  longitude: -8.001516,
  /** The villa's own Google Maps listing. */
  mapsUrl: "https://maps.google.com/?cid=9802313063739842588",
  /** How Google Maps finds that listing as a starting point, so a route reads "villa elk". */
  mapsQuery: "villa elk, HXFX+F99, Marrakech",
  plusCode: "HXFX+F99 Marrakech",
} as const;

/** Google Maps directions to the villa, from wherever the visitor is. */
export const VILLA_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VILLA_LOCATION.mapsQuery)}`;

/** Google's own embeddable map, centred on the villa's listing — no key needed. */
export function villaMapEmbed(language: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(VILLA_LOCATION.mapsQuery)}&z=15&hl=${language}&output=embed`;
}

export const VILLA_GEO = {
  "@type": "GeoCoordinates",
  latitude: VILLA_LOCATION.latitude,
  longitude: VILLA_LOCATION.longitude,
} as const;
