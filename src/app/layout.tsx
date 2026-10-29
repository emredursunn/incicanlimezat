import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: settings.storeName,
      template: `%s · ${settings.storeName}`,
    },
    description: siteConfig.description,
    openGraph: {
      title: settings.storeName,
      description: siteConfig.description,
      type: "website",
      locale: "tr_TR",
      siteName: settings.storeName,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
