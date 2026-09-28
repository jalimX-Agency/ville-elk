import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { locales } from "@/lib/i18n/locales";
import { getDefaultDictionary } from "@/lib/i18n/get-dictionary";
import { getAt, setAt } from "@/lib/content/dictionary-paths";
import { SECTIONS, fieldLabel, isSectionKey, sectionFields } from "@/lib/content/site-sections";
import { SectionForm, type EditableField } from "@/components/admin/SectionForm";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();
  const meta = SECTIONS.find((s) => s.key === section)!;

  const rows = await db.siteText.findMany({ where: { key: { startsWith: `${section}.` } } });
  // The text each language shows now: the code's, with the stored changes over it.
  const current = Object.fromEntries(
    locales.map((locale) => {
      const tree = structuredClone(getDefaultDictionary(locale));
      for (const row of rows.filter((r) => r.locale === locale)) setAt(tree, row.key, row.value);
      return [locale, tree];
    }),
  ) as Record<(typeof locales)[number], unknown>;
  const modifiedKeys = new Set(rows.map((row) => row.key));

  const fields: EditableField[] = sectionFields(section).map((field) => {
    const read = (locale: (typeof locales)[number]) => {
      const value = getAt(current[locale], field.path);
      return Array.isArray(value) ? value.join("\n") : String(value ?? "");
    };
    const fr = String(getAt(getDefaultDictionary("fr"), field.path) ?? "");
    return {
      path: field.path,
      label: fieldLabel(field.path),
      kind: field.kind,
      modified: modifiedKeys.has(field.path),
      values: { fr: read("fr"), en: read("en"), es: read("es"), ar: read("ar") },
      long: fr.length > 70,
    };
  });

  return (
    <>
      <Link href="/admin/textes" className="text-sm text-muted-foreground hover:text-primary">
        ← Textes du site
      </Link>
      <h1 className="mt-4 text-2xl font-light">{meta.title}</h1>
      {meta.hint && <p className="mt-2 max-w-prose text-muted-foreground">{meta.hint}</p>}
      <SectionForm section={section} fields={fields} />
    </>
  );
}
