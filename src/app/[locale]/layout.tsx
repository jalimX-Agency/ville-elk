import type { Metadata } from "next";
import { Fraunces, Albert_Sans, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, localeDirections, isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Navigation } from "@/components/villa/Navigation";
import { Footer } from "@/components/villa/Footer";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
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
          url: "/images/villa-elk/pool-rooftop-sunset.jpg",
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
    <html lang={locale} dir={dir}>
      <body
        className={`${fraunces.variable} ${albertSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navigation locale={locale as Locale} dict={dict} />
          <main className="flex-1">{children}</main>
          <Footer dict={dict} />
        </div>
      </body>
    </html>
  );
}
