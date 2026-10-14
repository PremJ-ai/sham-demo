import type { Metadata } from "next";
import { CollectionView } from "@/components/storefront";
import { collections, isCategory } from "@/lib/products";

export function generateStaticParams() {
  return Object.keys(collections).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = isCategory(params.slug) ? collections[params.slug] : null;
  return { title: item?.title ?? "Collection", description: item?.description ?? "Explore Atelier Formel menswear." };
}
export default function CollectionPage({ params }: { params: { slug: string } }) {
  return <CollectionView slug={params.slug} />;
}