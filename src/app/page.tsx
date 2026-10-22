import dynamic from "next/dynamic";
import { preload } from "react-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ShowcaseMarquee } from "@/components/ShowcaseMarquee";
import { TrustBadges } from "@/components/TrustBadges";
import { getSiteContent } from "@/lib/content/server";

const Categories = dynamic(() =>
  import("@/components/Categories").then((mod) => mod.Categories),
);
const ImageMarquee = dynamic(() =>
  import("@/components/ShowcaseMarquee").then((mod) => mod.ImageMarquee),
);
const FeaturedCollections = dynamic(() =>
  import("@/components/FeaturedCollections").then((mod) => mod.FeaturedCollections),
);
const ProductGrid = dynamic(() =>
  import("@/components/ProductGrid").then((mod) => mod.ProductGrid),
);
const Occasions = dynamic(() =>
  import("@/components/Occasions").then((mod) => mod.Occasions),
);
const Testimonials = dynamic(() =>
  import("@/components/Testimonials").then((mod) => mod.Testimonials),
);
const Consultation = dynamic(() =>
  import("@/components/Consultation").then((mod) => mod.Consultation),
);

export default async function Home() {
  const { hero } = await getSiteContent();
  const heroImage = hero.slides[0]?.image;
  if (heroImage?.startsWith("/")) {
    preload(heroImage, { as: "image", fetchPriority: "high" });
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ShowcaseMarquee />
        <TrustBadges />
        <Categories />
        <ImageMarquee />
        <FeaturedCollections />
        <ProductGrid />
        <Occasions />
        <Testimonials />
        <Consultation />
      </main>
      <Footer />
    </>
  );
}
