import Image from "next/image";
import { notFound } from "next/navigation";

import AddToCartButton from "@/components/product/add-to-cart-button";
import ProductGrid from "@/components/product/product-grid";
import ProductPrice from "@/components/product/product-price";
import {
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
} from "@/utils/woocommerce";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await fetchProducts({ per_page: 10 });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  const plainDescription = product?.short_description
    ? product.short_description.replace(/<[^>]+>/g, "").trim()
    : "Upplýsingar úr WooCommerce vöruskrá.";

  return {
    title: product
      ? `${product.name} | Tactica Vefverslun`
      : "Vara fannst ekki",
    description: plainDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await fetchRelatedProducts(product);
  const image = product.images?.[0];

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[.04] p-4">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              width={960}
              height={960}
              className="w-full rounded-2xl object-cover"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/20 text-white/50">
              Engin vörumynd
            </div>
          )}
        </div>
        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[.04] p-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              {product.categories.map((cat) => cat.name).join(" / ")}
            </p>
            <h1 className="text-4xl font-semibold text-white">{product.name}</h1>
            <ProductPrice product={product} />
          </div>
          <div
            className="text-sm leading-relaxed text-white/70"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <AddToCartButton product={product} />
          <dl className="grid gap-4 rounded-2xl border border-white/10 bg-white/[.02] p-4 text-sm text-white/70 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-widest text-white/40">
                Vörunúmer
              </dt>
              <dd className="font-semibold text-white">
                {product.sku || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-white/40">
                Birgðir
              </dt>
              <dd className="font-semibold text-white">
                {product.stock_status === "instock" ? "Til á lager" : "Uppselt"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Tengdar vörur
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Við mælum líka með
            </h2>
          </div>
        </div>
        <ProductGrid
          products={related}
          emptyState="Bættu tengdum vörum í WooCommerce til að fylla þennan hluta."
        />
      </section>
    </div>
  );
}
