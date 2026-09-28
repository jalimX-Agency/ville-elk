import { PageHeader } from "@/components/admin/PageHeader";
import { getContact, getSettings, type SettingKey } from "@/lib/content/site";
import { SettingsForm } from "@/components/admin/SettingsForm";

const LEVELS = ["Rez-de-chaussée", "Sous-sol", "Étage", "Rooftop"];

export default async function SettingsPage() {
  const [contact, settings] = await Promise.all([getContact(), getSettings()]);
  const item = (key: SettingKey, label: string) => ({ key, label, value: settings[key] });

  const images = [
    { group: "Photo d'ouverture de l'accueil", items: [item("image.hero", "Révélée à travers la porte du logo")] },
    {
      group: "Photos de « niveau par niveau »",
      items: ([0, 1, 2, 3] as const).flatMap((i) => [
        item(`image.levels.${i}.main`, `${LEVELS[i]} — grande photo`),
        item(`image.levels.${i}.detail`, `${LEVELS[i]} — petite photo`),
      ]),
    },
    {
      group: "Photos des deux portes en bas de l'accueil",
      items: [item("image.explore.suites", "Porte « Suites »"), item("image.explore.gallery", "Porte « Galerie »")],
    },
    { group: "Page Conciergerie", items: [item("image.concierge", "Photo à côté du titre")] },
  ];

  return (
    <>
      <PageHeader title="Réglages" description="Les coordonnées de la villa et les photos des pages. Les photos des suites, des prestations et de la galerie se changent dans leurs sections." />
      <SettingsForm contact={contact} images={images} />
    </>
  );
}
