import { Mail, MessageCircle, AtSign } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

const WHATSAPP_NUMBER = "212632809000";
const EMAIL = "villaelkkech@gmail.com";
const INSTAGRAM_HANDLE = "villaelkkech";

export function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-28 text-center">
      <span className="eyebrow text-primary">{dict.contact.eyebrow}</span>
      <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{dict.contact.title}</h2>
      <p className="body-copy mx-auto mt-5 max-w-lg text-lg">{dict.contact.description}</p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <MessageCircle className="h-4 w-4" />
          {dict.contact.whatsappCta}
        </a>
        <a href={`mailto:${EMAIL}`} className="btn-outline">
          <Mail className="h-4 w-4" />
          {dict.contact.emailCta}
        </a>
        <a
          href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          <AtSign className="h-4 w-4" />{INSTAGRAM_HANDLE}
        </a>
      </div>
    </section>
  );
}
