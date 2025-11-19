"use client";

import Link from "next/link";

import { formatCurrency } from "@/lib/price";
import { useCart } from "@/components/cart/cart-provider";

export default function CartLink() {
  const { totalItems, subtotal } = useCart();

  return (
    <Link
      href="/cart"
      className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
    >
      <span className="text-xs uppercase tracking-wide text-white/70">
        Karfa
      </span>
      <span className="text-base font-bold">{totalItems}</span>
      <span className="text-sm font-medium text-emerald-300">
        {formatCurrency(subtotal)}
      </span>
    </Link>
  );
}
