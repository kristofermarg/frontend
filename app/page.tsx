import Hero from "@/components/sections/hero";
import ProductGrid from "@/components/product/product-grid";
import { fetchLatestProducts } from "@/utils/woocommerce";

export const revalidate = 120;

export default async function Home() {
  const latest = await fetchLatestProducts();

  return (
    <>
      <Hero />
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Nýtt í vefverslun
            </p>
            <h2 className="text-3xl font-semibold">Nýjar vörur</h2>
          </div>
        </div>
        <ProductGrid products={latest} />
      </section>
    </>
  );
}
