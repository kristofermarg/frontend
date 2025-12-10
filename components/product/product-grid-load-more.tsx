"use client";

import { useEffect, useState } from "react";

import ProductGrid from "@/components/product/product-grid";
import type { Product } from "@/types/woocommerce";

type Props = {
  initialProducts: Product[];
  initialPage: number;
  query?: string;
  categoryId?: number | null;
  perPage: number;
  loadMoreLabel: string;
  emptyState?: string;
};

const buildQueryString = (
  page: number,
  perPage: number,
  query?: string,
  categoryId?: number | null,
) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("perPage", String(perPage));
  if (query) params.set("query", query);
  if (categoryId) params.set("categoryId", String(categoryId));
  return params.toString();
};

export default function ProductGridLoadMore({
  initialProducts,
  initialPage,
  query,
  categoryId,
  perPage,
  loadMoreLabel,
  emptyState,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === perPage);
  const [error, setError] = useState<string | null>(null);

  // Keep list in sync when filters/search change without requiring a full reload.
  useEffect(() => {
    setProducts(initialProducts);
    setPage(initialPage);
    setHasMore(initialProducts.length === perPage);
    setError(null);
  }, [initialProducts, initialPage, perPage, query, categoryId]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);
    setError(null);
    const nextPage = page + 1;
    try {
      const queryString = buildQueryString(nextPage, perPage, query, categoryId);
      const response = await fetch(`/api/products?${queryString}`);
      if (!response.ok) {
        throw new Error("Ekki tókst að sækja fleiri vörur.");
      }

      const data = (await response.json()) as { products: Product[] };
      const newProducts = data.products ?? [];
      setProducts((prev) => [...prev, ...newProducts]);
      setPage(nextPage);
      if (newProducts.length < perPage) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Óvænt villa kom upp.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProductGrid products={products} emptyState={emptyState} />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {hasMore ? (
        <div className="text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Hleð inn..." : loadMoreLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
