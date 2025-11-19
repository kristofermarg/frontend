"use client";

import Link from "next/link";

import CartLineItem from "@/components/cart/cart-line-item";
import CartSummary from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";

export default function CartPage() {
  const { items } = useCart();

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[.03] p-12 text-center text-white/70">
        <p className="text-xl font-semibold text-white">Karfan þín er tóm</p>
        <p className="mt-2 text-sm">
          Kíktu á nýjustu vörurnar í vefversluninni og bættu þeim í körfuna.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Skoða vörur
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,_1fr)_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <CartLineItem key={item.product.id} item={item} />
        ))}
      </div>
      <CartSummary />
    </div>
  );
}
