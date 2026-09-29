import { getContact, getDictionary } from "@/lib/content/site";
import { getSuites } from "@/lib/content/rooms";
import { getAmenities } from "@/lib/content/amenities";
import { getActivities } from "@/lib/content/activities";
import { VILLA_LOCATION } from "@/lib/content/location";
import { locales } from "@/lib/i18n/locales";
import { hrefFor, suiteHref, type PageKey } from "@/lib/i18n/routes";
import { SITE } from "@/lib/seo";
import { formatPhone } from "@/lib/content/phone";

export const revalidate = 3600;

/**
 * /llms.txt — the villa in plain Markdown for AI assistants (llmstxt.org):
 * the facts they are asked about, and where each page lives in each language.
 * Built from the same content as the site, so it never contradicts it.
 */
export async function GET() {
  const [en, fr, contact, suites, amenities, activities] = await Promise.all([
    getDictionary("en"),
    getDictionary("fr"),
    getContact(),
    getSuites(),
    getAmenities(),
    getActivities(),
  ]);

  const link = (page: PageKey) =>
    locales.map((l) => `[${l.toUpperCase()}](${SITE}${hrefFor(page, l)})`).join(" · ");

  const pages: [PageKey, string][] = [
    ["suites", "The four suites, with photos and equipment"],
    ["gallery", "Photo gallery of the whole villa, level by level"],
    ["booking", "Availability calendar and booking request"],
    ["concierge", "Private concierge services and rates"],
    ["activities", "Golf, leisure and restaurants within 10 minutes"],
    ["contact", "WhatsApp, email, address and map"],
  ];

  const text = `# Villa Elk

> ${en.meta.description}

Villa Elk is a private luxury villa for rent in Marrakech, Morocco, at Golf Argan Resort in the Agdal district. It is rented directly from the owner through ${SITE}.

## Key facts

- Location: Golf Argan Resort, extension, villa 2, Agdal, Marrakech, Morocco (Plus Code ${VILLA_LOCATION.plusCode}; ${VILLA_LOCATION.latitude}, ${VILLA_LOCATION.longitude})
- Capacity: 4 suites, up to 10 guests, over four levels (wellness basement with hammam, cinema and gym; ground floor with the private pool; suites upstairs; Moroccan rooftop)
- Rate: ${en.stay.from.toLowerCase()} ${en.stay.price} ${en.stay.per} (${en.stay.approx})
- Tourist tax: ${en.stay.tax} (${en.stay.taxApprox})
- Minimum stay: 3 nights
- Check-in from 15:00, check-out by 11:00
- Languages spoken: Arabic, French, English
- Drive times: ${en.location.places.map((p) => `${p.label} ${p.minutes} min`).join("; ")}
- Contact: ${contact.email} · WhatsApp ${formatPhone(contact.whatsapp)} · Instagram @${contact.instagram}
- Google Maps: ${VILLA_LOCATION.mapsUrl}

## Amenities

${amenities.map((a) => `- ${a.name.en || a.name.fr}`).join("\n")}

## Suites

${suites
  .map(
    (s) =>
      `- [${s.name.en || s.name.fr}](${SITE}${suiteHref(s.slug, "en")})${s.areaSqm ? ` — ${s.areaSqm} m²` : ""}: ${s.description.en || s.description.fr}`,
  )
  .join("\n")}

## Pages

- Home: ${locales.map((l) => `[${l.toUpperCase()}](${SITE}/${l})`).join(" · ")}
${pages.map(([page, label]) => `- ${label}: ${link(page)}`).join("\n")}

## Nearby

${activities.map((a) => `- ${a.name.en || a.name.fr}: ${a.minutes} min by car`).join("\n")}

## Frequently asked questions

${en.faq.questions.map((q) => `### ${q.question}\n\n${q.answer}`).join("\n\n")}

## En français

${fr.meta.description}

${fr.faq.questions.map((q) => `- **${q.question}** ${q.answer}`).join("\n")}

## Optional

- [Legal notice](${SITE}${hrefFor("legal", "en")})
- [Privacy policy](${SITE}${hrefFor("privacy", "en")})
`;

  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
