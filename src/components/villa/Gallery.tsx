import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

const photos = [
  { src: "pool-rooftop-day.jpg", alt: "Piscine privée sur le toit, en journée" },
  { src: "tv-lounge-onyx-1.jpg", alt: "Salon avec mur en onyx et cheminée" },
  { src: "salon-marocain.jpg", alt: "Salon marocain traditionnel" },
  { src: "hammam.jpg", alt: "Hammam en marbre travertin" },
  { src: "dining-terrace.jpg", alt: "Salle à manger ouverte sur la terrasse" },
  { src: "bathroom-gold.jpg", alt: "Salle de bain aux finitions dorées" },
  { src: "bedroom-1.jpg", alt: "Chambre" },
  { src: "bedroom-2.jpg", alt: "Chambre avec accès balcon" },
  { src: "rooftop-garden.jpg", alt: "Jardin sur le toit" },
  { src: "gym.jpg", alt: "Salle de sport avec vue sur le patio de bambous" },
  { src: "hallway-marble.jpg", alt: "Couloir en marbre" },
  { src: "staircase.jpg", alt: "Escalier en marbre et verre" },
];

export function Gallery({ dict }: { dict: Dictionary }) {
  return (
    <section id="galerie" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <span className="eyebrow text-primary">{dict.gallery.eyebrow}</span>
        <h2 className="heading-display mt-4 max-w-xl text-4xl sm:text-5xl">{dict.gallery.title}</h2>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 [scrollbar-width:thin] lg:gap-6">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="relative h-[60vh] max-h-[520px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-sm sm:w-[46vw] lg:w-[32vw]"
          >
            <Image
              src={`/images/villa-elk/${photo.src}`}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 32vw"
              className="img-reveal object-cover hover:scale-[1.04]"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <p className="eyebrow mx-auto mt-6 max-w-6xl px-6 text-foreground/40">{dict.gallery.note}</p>
    </section>
  );
}
