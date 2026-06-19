import { Categories } from "@/components/Categories";
import { Consultation } from "@/components/Consultation";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Occasions } from "@/components/Occasions";
import { ProductGrid } from "@/components/ProductGrid";
import { ImageMarquee, ShowcaseMarquee } from "@/components/ShowcaseMarquee";
import { Testimonials } from "@/components/Testimonials";
import { TrustBadges } from "@/components/TrustBadges";

export default function Home() {
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
