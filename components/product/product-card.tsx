import Image from "next/image";
import Link from "next/link";

import AddToCartButton from "@/components/product/add-to-cart-button";
import ProductPrice from "@/components/product/product-price";
import type { Product } from "@/types/woocommerce";

type Props = {
  product: Product;
};

const fallbackImage =
  "https://backend.webdev.is/wp-content/uploads/woocommerce-placeholder.png";

export default function ProductCard({ product }: Props) {
  const thumbnail = product.images?.[0]?.src ?? fallbackImage;

  return (
    <article className="group flex flex-col rounded-3xl border border-white/5 bg-white/5 p-4 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-white/10">
      <Link
        href={`/products/${product.slug}`}
        className="relative mb-4 block overflow-hidden rounded-2xl bg-slate-900"
      >
        <Image
          src={thumbnail}
          alt={product.images?.[0]?.alt || product.name}
          width={640}
          height={640}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.on_sale ? (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
            Útsala
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-lg font-semibold text-white transition hover:text-emerald-200"
          >
            {product.name}
          </Link>
          <p
            className="mt-1 text-sm text-white/60 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        </div>
        <ProductPrice product={product} />
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
