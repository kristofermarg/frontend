import type { Metadata } from "next";

import CartPage from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Karfa | Tactica Vefverslun",
};

export default function Cart() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Karfa
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Farðu yfir vörurnar þínar
        </h1>
      </div>
      <CartPage />
    </section>
  );
}
