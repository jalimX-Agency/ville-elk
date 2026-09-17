import type { Metadata } from "next";
import { Antic_Didone, Albert_Sans, IBM_Plex_Mono, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, localeDirections, isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Navigation } from "@/components/villa/Navigation";
import { Footer } from "@/components/villa/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeToggle";
import "lenis/dist/lenis.css";
import "../globals.css";

// Display face matches the logo wordmark.
const antic = Antic_Didone({
  variable: "--font-antic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const albert = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

// Arabic pair: Amiri's calligraphic contrast sits beside Antic Didone; Plex Arabic for text.
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL("https://www.villaelk.com"),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `https://www.villaelk.com/${locale}`,
      siteName: "Villa Elk",
      images: [
        {
          url: "/images/villa-elk/pool-terrace-sunset.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const dir = localeDirections[locale as Locale];

  return (
    <html
      lang={locale}
      dir={dir}
      // next-themes sets data-theme before hydration; the attribute legitimately differs from SSR
      suppressHydrationWarning
      className={`${antic.variable} ${albert.variable} ${plexMono.variable} ${amiri.variable} ${plexArabic.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>
          <SmoothScroll>
            <div className="flex min-h-screen flex-col">
              <Navigation locale={locale as Locale} dict={dict} />
              <main className="flex-1">{children}</main>
              <Footer dict={dict} />
            </div>
          </SmoothScroll>
          <ThemeToggle labels={dict.theme} />
        </ThemeProvider>
      </body>
    </html>
  );
}
