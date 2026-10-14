import type { Metadata } from "next";
import { CollectionView } from "@/components/storefront";
import { collections, isCategory } from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(collections).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = isCategory(slug) ? collections[slug] : null;
  return { title: item?.title ?? "Collection", description: item?.description ?? "Explore Atelier Formel menswear." };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollectionView slug={slug} />;
}