import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteEffects } from "@/components/effects/SiteEffects";
import { getSiteContent } from "@/lib/content/server";
import "./globals.css";

export const dynamic = "force-dynamic";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();
  return {
    title: `${site.name} | Gold & Diamond Jewellery Online`,
    description: site.description,
    metadataBase: new URL(site.url),
    keywords: [
      "gold jewellery",
      "diamond jewellery",
      "bridal jewellery",
      "online jewellery store",
      site.name,
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialContent = await getSiteContent();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteEffects initialContent={initialContent}>{children}</SiteEffects>
      </body>
    </html>
  );
}
