import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteEffects } from "@/components/effects/SiteEffects";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | Gold & Diamond Jewellery Online`,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "gold jewellery",
    "diamond jewellery",
    "bridal jewellery",
    "online jewellery store",
    siteConfig.name,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteEffects>{children}</SiteEffects>
      </body>
    </html>
  );
}
