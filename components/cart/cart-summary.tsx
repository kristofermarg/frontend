"use client";

import Link from "next/link";

import { formatCurrency } from "@/lib/price";
import { useCart } from "@/components/cart/cart-provider";

export default function CartSummary() {
  const { subtotal, totalItems } = useCart();
  const shipping = subtotal > 0 ? 0 : 0;

  return (
    <aside className="sticky top-28 rounded-3xl border border-white/10 bg-white/[.04] p-6 text-white">
      <h3 className="text-lg font-semibold">Yfirlit pöntunar</h3>
      <dl className="mt-6 space-y-4 text-sm text-white/70">
        <div className="flex justify-between">
          <dt>Vörur ({totalItems})</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Sending</dt>
          <dd>{shipping === 0 ? "Frítt" : formatCurrency(shipping)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold text-white">
          <dt>Samtals</dt>
          <dd>{formatCurrency(subtotal + shipping)}</dd>
        </div>
      </dl>
      <Link
        href="/checkout"
        className="mt-6 block rounded-full bg-emerald-400/90 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        Fara í greiðsluferli
      </Link>
    </aside>
  );
}
