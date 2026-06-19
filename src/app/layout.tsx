import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteEffects } from "@/components/effects/SiteEffects";
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
  title: "Rushabh Jewellers | Gold & Diamond Jewellery Online",
  description:
    "Shop exquisite gold and diamond jewellery online. BIS hallmarked, handcrafted designs for weddings, festivals, and everyday elegance.",
  keywords: [
    "gold jewellery",
    "diamond jewellery",
    "bridal jewellery",
    "online jewellery store",
    "Rushabh Jewellers",
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
