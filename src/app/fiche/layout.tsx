import type { Metadata } from "next";
import "../globals.css";

// A guest's private page: never indexed, never linked from the site.
export const metadata: Metadata = {
  title: "Villa Elk",
  robots: { index: false, follow: false },
};

export default function FicheLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#f3efe8] antialiased">{children}</body>
    </html>
  );
}
