import { Waves, Droplets, Trees, Dumbbell, Clapperboard, Car, Wind, Flame } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

const icons = {
  piscine: Waves,
  hammam: Droplets,
  jardin: Trees,
  gym: Dumbbell,
  cinema: Clapperboard,
  parking: Car,
  climatisation: Wind,
  barbecue: Flame,
} as const;

export function Amenities({ dict }: { dict: Dictionary }) {
  const entries = Object.entries(dict.amenities.items) as [keyof typeof icons, string][];

  return (
    <section id="prestations" className="bg-card px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow text-primary">{dict.amenities.eyebrow}</span>
        <h2 className="heading-display mt-4 max-w-xl text-4xl sm:text-5xl">
          {dict.amenities.title}
        </h2>

        <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map(([key, label]) => {
            const Icon = icons[key];
            return (
              <li key={key} className="flex flex-col gap-3">
                <Icon className="h-6 w-6 text-brass" strokeWidth={1.5} />
                <span className="text-sm text-foreground/85">{label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
