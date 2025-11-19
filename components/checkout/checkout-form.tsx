"use client";

import { FormEvent, useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { CartShape } from "@/types/woocommerce";
import { formatCurrency } from "@/lib/price";

const initialForm = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
  email: "",
  phone: "",
};

const fieldLabels: Record<keyof typeof initialForm, string> = {
  first_name: "Fornafn",
  last_name: "Eftirnafn",
  company: "Fyrirtæki",
  address_1: "Heimilisfang",
  address_2: "Íbúð / viðbótarupplýsingar",
  city: "Bær",
  state: "Sýsla",
  postcode: "Póstnúmer",
  country: "Land",
  email: "Netfang",
  phone: "Sími",
};

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const lineItems = useMemo(
    () =>
      items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    [items],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lineItems.length) {
      setError("Bættu a.m.k. einni vöru í körfuna áður en greiðsluferli hefst.");
      return;
    }

    setStatus("loading");
    setError(null);

    const payload: CartShape = {
      payment_method: "cod",
      payment_method_title: "Greitt við afhendingu",
      billing: { ...form },
      shipping: {
        ...form,
        email: form.email,
      },
      line_items: lineItems,
      shipping_lines: [
        {
          method_title: "Hraðsending",
          method_id: "flat_rate",
          total: "0",
          total_tax: "0",
        },
      ],
      customer_id: 0,
      set_paid: false,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.message ?? "Ekki tókst að ljúka greiðsluferlinu.",
        );
      }

      setStatus("success");
      clearCart();
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Óvænt villa kom upp í greiðsluferlinu.",
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/[.04] p-8 text-white"
    >
      <div>
        <h2 className="text-2xl font-semibold">Greiðsluferli</h2>
        <p className="mt-2 text-sm text-white/60">
          Sláðu inn greiðslu- og sendingarupplýsingar og við búum til pöntun í
          WooCommerce.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(form).map(([key, value]) => {
          const label =
            fieldLabels[key as keyof typeof initialForm] ??
            key.replace(/_/g, " ");
          const spanFull = ["address_1", "address_2", "company"].includes(key)
            ? "sm:col-span-2"
            : "sm:col-span-1";
          return (
            <label
              key={key}
              className={`text-sm font-medium text-white/70 ${spanFull}`}
            >
              <span className="mb-1 block text-xs uppercase tracking-wide text-white/50">
                {label}
              </span>
              <input
                type={key === "email" ? "email" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
                required={["first_name", "last_name", "email", "address_1"].includes(key)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
              />
            </label>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
        <div>
          <p className="text-sm text-white/60">Upphæð til greiðslu</p>
          <p className="text-2xl font-semibold">
            {formatCurrency(subtotal || 0)}
          </p>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-emerald-400/90 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Vinnsla..." : "Staðfesta pöntun"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-300">
          Pöntun hefur verið stofnuð! Skoðaðu WooCommerce stjórnborðið til að
          sjá nýju færsluna.
        </p>
      ) : null}
    </form>
  );
}
