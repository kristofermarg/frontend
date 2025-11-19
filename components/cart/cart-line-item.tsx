"use client";

import Image from "next/image";

import { formatCurrency } from "@/lib/price";
import type { CartItem } from "@/components/cart/cart-provider";
import { useCart } from "@/components/cart/cart-provider";

type Props = {
  item: CartItem;
};

export default function CartLineItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const thumbnail = item.product.images?.[0]?.src;

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={item.product.name}
          width={96}
          height={96}
          className="h-24 w-24 rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 text-white/50">
          Engin mynd
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-white">{item.product.name}</p>
            <p className="text-sm text-white/60">
              {formatCurrency(item.product.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.product.id)}
            className="text-xs uppercase tracking-wide text-white/50 transition hover:text-red-300"
          >
            Fjarlægja
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-wide text-white/50">
            Magn
          </label>
          <div className="flex items-center rounded-full border border-white/10">
            <button
              type="button"
              className="px-3 py-1 text-lg text-white/70"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              -
            </button>
            <span className="px-4 text-sm font-semibold text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              className="px-3 py-1 text-lg text-white/70"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
