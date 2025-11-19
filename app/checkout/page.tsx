import type { Metadata } from "next";

import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Greiðsluferli | Tactica Vefverslun",
  description: "Ljúktu WooCommerce pöntuninni þinni hér.",
};

export default function CheckoutPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Greiðsluferli
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Öruggt og hratt ferli
        </h1>
      </div>
      <CheckoutForm />
    </section>
  );
}
