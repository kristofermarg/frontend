"use client";

import { useTransition } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/types/woocommerce";

type Props = {
  product: Product;
};

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(() => {
      addItem(product, 1);
    });
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isPending || product.stock_status === "outofstock"}
      className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {product.stock_status === "outofstock"
        ? "Uppselt"
        : isPending
          ? "Bæti við..."
          : "Setja í körfu"}
    </button>
  );
}
