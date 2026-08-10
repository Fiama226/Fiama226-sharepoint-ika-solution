import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IKA Solution — Intranet",
    template: "%s · Intranet IKA Solution",
  },
  description:
    "Intranet interne IKA Solution : actualités, documents, équipe et événements par département.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-brand-surface text-brand-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
