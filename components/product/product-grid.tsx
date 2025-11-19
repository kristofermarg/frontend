import ProductCard from "@/components/product/product-card";
import type { Product } from "@/types/woocommerce";

type Props = {
  products: Product[];
  emptyState?: string;
};

export default function ProductGrid({
  products,
  emptyState = "Engar vörur tiltækar þessa stundina.",
}: Props) {
  if (!products?.length) {
    return (
      <p className="rounded-2xl border border-dashed border-white/20 bg-white/[.03] px-6 py-12 text-center text-sm text-white/60">
        {emptyState}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
