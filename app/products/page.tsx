import Link from "next/link";

import ProductGridLoadMore from "@/components/product/product-grid-load-more";
import { fetchCategories, fetchProducts } from "@/utils/woocommerce";

type Props = {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    page?: string;
  }>;
};

export const revalidate = 60;

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedParams = (await searchParams) ?? {};
  const query = resolvedParams.query ?? "";
  const category = resolvedParams.category ?? "";
  const parsedPage = Number.parseInt(resolvedParams.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const categories = await fetchCategories();
  const selectedCategory = categories.find(
    (cat) => cat.slug === category || String(cat.id) === category,
  );

  const perPage = 12;
  const products = await fetchProducts({
    search: query || undefined,
    category: selectedCategory?.id,
    page,
    per_page: perPage,
  });

  const buildHref = (
    options: { categoryValue?: string; pageValue?: number } = {},
  ) => {
    const { categoryValue, pageValue } = options;
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (categoryValue) params.set("category", categoryValue);
    if (pageValue && pageValue > 1) {
      params.set("page", String(pageValue));
    }
    const search = params.toString();
    return search ? `/products?${search}` : "/products";
  };
  const categoryId = selectedCategory?.id ?? null;
  const emptyState =
    "Engar vörur fundust með þessum skilyrðum. Breyttu leitinni eða prófaðu annan flokk.";

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
        <h1 className="text-3xl font-semibold text-white">Vefverslun</h1>
        <p className="mt-2 text-sm text-white/60">
          Síaðu eftir vöruflokkum eða leitaðu í WooCommerce vörusafninu í rauntíma.
        </p>
        <form className="mt-6 flex gap-4">
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Leita að vörum"
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Leita
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={buildHref()}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !category
                ? "bg-emerald-400/90 text-slate-950"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            Allt
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildHref({ categoryValue: cat.slug })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === cat.slug || category === String(cat.id)
                  ? "bg-emerald-400/90 text-slate-950"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
      <ProductGridLoadMore
        initialProducts={products}
        initialPage={page}
        query={query || undefined}
        categoryId={categoryId}
        perPage={perPage}
        emptyState={emptyState}
        loadMoreLabel="Fleiri vörur"
      />
    </div>
  );
}
