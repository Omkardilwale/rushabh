import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductById } from "@/lib/data";
import { getSiteContent } from "@/lib/content/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { site } = await getSiteContent();
  const product = getProductById(Number(id));

  if (!product) {
    return { title: `Product Not Found | ${site.name}` };
  }

  return {
    title: `${product.name} | ${site.name}`,
    description: `Shop ${product.name} — ${product.metal} ${product.category}. BIS hallmarked jewellery with free shipping.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  await getSiteContent();
  const product = getProductById(productId);

  if (Number.isNaN(productId) || !product) {
    notFound();
  }

  if (product.image.startsWith("/")) {
    preload(product.image, { as: "image", fetchPriority: "high" });
  }

  return <ProductDetail id={productId} />;
}
