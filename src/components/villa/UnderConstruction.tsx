import { Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CONTACT } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function UnderConstruction({ dict }: { dict: Dictionary }) {
  return (
    <section id="bientot" aria-labelledby="building-title" className="border-t border-border px-6 py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[auto_1fr] md:gap-20">
        <div aria-hidden="true">
          <Logo variant="mark" className="w-28 opacity-80 md:w-36" />
        </div>
        <div>
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
            {dict.building.eyebrow}
          </p>
          <h2 id="building-title" className="heading-display mt-4 text-4xl text-foreground sm:text-5xl">
            {dict.building.title}
          </h2>
          <p className="body-copy mt-5 max-w-xl text-lg">{dict.building.body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageCircle className="h-4 w-4" />
              {dict.contact.whatsappCta}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="btn-quiet">
              <Mail className="h-4 w-4" />
              {dict.contact.emailCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
