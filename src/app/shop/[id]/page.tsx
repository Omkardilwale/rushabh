import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductById } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(Number(id));

  if (!product) {
    return { title: "Product Not Found | Rushabh Jewellers" };
  }

  return {
    title: `${product.name} | Rushabh Jewellers`,
    description: `Shop ${product.name} — ${product.metal} ${product.category}. BIS hallmarked jewellery with free shipping.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId) || !getProductById(productId)) {
    notFound();
  }

  return <ProductDetail id={productId} />;
}
