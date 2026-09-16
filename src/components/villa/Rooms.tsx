import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function Rooms({ dict }: { dict: Dictionary }) {
  return (
    <section id="chambres" className="bg-card px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative h-[420px] overflow-hidden rounded-sm lg:h-full lg:min-h-[480px]">
          <Image
            src="/images/villa-elk/bedroom-2.jpg"
            alt="Chambre de Villa Elk avec accès balcon"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="eyebrow text-primary">{dict.booking.eyebrow}</span>
          <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{dict.booking.title}</h2>
          <p className="body-copy mt-4">{dict.booking.currency}</p>

          <div className="mt-10 border-t border-border pt-8">
            <h3 className="eyebrow text-foreground/60">{dict.booking.policyTitle}</h3>
            <ul className="mt-4 space-y-3">
              {dict.booking.policyLines.map((line) => (
                <li key={line} className="flex gap-3 text-sm text-foreground/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
