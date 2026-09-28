"use client";

import { createContext, useContext, useState } from "react";

export const LANGS = [
  { code: "fr", label: "Français", short: "FR", dir: "ltr" },
  { code: "en", label: "English", short: "EN", dir: "ltr" },
  { code: "es", label: "Español", short: "ES", dir: "ltr" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

const Active = createContext<LangCode>("fr");

/**
 * One language at a time for the whole screen: pick it once at the top and
 * every field follows. The other languages stay in the form, only hidden, so a
 * single save still stores all four.
 */
export function LangProvider({
  children,
  sticky = true,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) {
  const [lang, setLang] = useState<LangCode>("fr");
  return (
    <Active.Provider value={lang}>
      <div
        role="tablist"
        aria-label="Langue"
        className={
          "z-10 -mx-1 mb-6 flex gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 shadow-sm " +
          (sticky ? "sticky top-16 lg:top-4" : "")
        }
      >
        {LANGS.map((item) => (
          <button
            key={item.code}
            type="button"
            role="tab"
            aria-selected={lang === item.code}
            onClick={() => setLang(item.code)}
            className="admin-tab flex-1 justify-center"
          >
            <span className="sm:hidden">{item.short}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
      {children}
    </Active.Provider>
  );
}

/** Renders every language's version, showing only the chosen one. */
export function PerLang({ children }: { children: (lang: (typeof LANGS)[number]) => React.ReactNode }) {
  const active = useContext(Active);
  return (
    <>
      {LANGS.map((lang) => (
        <div key={lang.code} hidden={lang.code !== active}>
          {children(lang)}
        </div>
      ))}
    </>
  );
}

export function useActiveLang() {
  return useContext(Active);
}
