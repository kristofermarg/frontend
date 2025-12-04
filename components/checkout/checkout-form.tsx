"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/price";
import { fetchPostisRates } from "@/lib/postis";
import type { CartShape } from "@/types/woocommerce";

const initialForm = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  postcode: "",
  email: "",
  phone: "",
};

const paymentMethods: {
  id: CartShape["payment_method"];
  title: string;
  description?: string;
}[] = [
  {
    id: "bacs",
    title: "Greiðsla með millifærslu",
    description: "Staðfestu pöntun og millifærðu inn á reikning Tactica.",
  },
  {
    id: "cod",
    title: "Greitt við afhendingu",
    description: "Greiðsla fer fram á ákvörðuðum afhendingarstað.",
  },
];

const fieldLabels: Record<keyof typeof initialForm, string> = {
  first_name: "Fornafn",
  last_name: "Eftirnafn",
  company: "Fyrirtæki",
  address_1: "Heimilisfang",
  address_2: "Ábending / viðbótarupplýsingar",
  city: "Bær",
  postcode: "Póstnúmer",
  email: "Netfang",
  phone: "Sími",
};

type ShippingRate = Awaited<ReturnType<typeof fetchPostisRates>>[number];
type OrderConfirmationRoute =
  | "/order-confirmation"
  | `/order-confirmation?orderId=${string}`;

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState<CartShape["payment_method"]>(
    paymentMethods[0].id,
  );
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
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

  const selectedPaymentMethod = useMemo(
    () =>
      paymentMethods.find((method) => method.id === paymentMethod) ??
      paymentMethods[0],
    [paymentMethod],
  );

  const selectedShippingCost = useMemo(
    () =>
      shippingRates.find((rate) => rate.id === selectedShippingId)?.cost ??
      shippingRates[0]?.cost ??
      0,
    [selectedShippingId, shippingRates],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadShippingRates = useCallback(async () => {
    if (!form.postcode) {
      setError("Vinsamlegast sláðu inn póstnúmer til að sækja sendingarleiðir.");
      return [];
    }

    if (!lineItems.length) {
      setError("Bættu a.m.k. einni vöru í körfuna áður en þú pantar.");
      return [];
    }

    setShippingLoading(true);
    setError(null);

    try {
      const rates = await fetchPostisRates(
        lineItems.map((line) => ({
          productId: line.product_id,
          quantity: line.quantity,
        })),
        {
        country: "IS",
        city: form.city,
        postcode: form.postcode,
        address_1: form.address_1,
        address_2: form.address_2,
          state: undefined,
        },
      );
      setShippingRates(rates);
      if (rates.length) {
        const nextSelected = rates.find((rate) => rate.id === selectedShippingId);
        setSelectedShippingId(nextSelected?.id ?? rates[0].id);
      }
      return rates;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ekki tókst að sækja sendingarmáta.",
      );
      return [];
    } finally {
      setShippingLoading(false);
    }
  }, [form, lineItems, selectedShippingId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lineItems.length) {
      setError("Bættu a.m.k. einni vöru í körfuna áður en greiðsluferli hefst.");
      return;
    }

    setStatus("loading");
    setError(null);

    const rates = await loadShippingRates();
    const shippingChoice =
      rates.find((rate) => rate.id === selectedShippingId) ??
      shippingRates.find((rate) => rate.id === selectedShippingId) ??
      rates[0] ??
      shippingRates[0];

    const payload: CartShape = {
      payment_method: selectedPaymentMethod.id,
      payment_method_title: selectedPaymentMethod.title,
      billing: { ...form, country: "IS", state: "" },
      shipping: {
        ...form,
        country: "IS",
        state: "",
        email: form.email,
      },
      line_items: lineItems,
      shipping_lines: shippingChoice
        ? [
            {
              method_title: shippingChoice.label,
              method_id: shippingChoice.method_id || shippingChoice.id,
              total: String(shippingChoice.cost ?? 0),
              total_tax: "0",
            },
          ]
        : [
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

      const data = await response.json().catch(() => null);
      setStatus("success");
      clearCart();
      setForm(initialForm);
      setPaymentMethod(paymentMethods[0].id);
      setShippingRates([]);
      setSelectedShippingId(null);
      const orderId = data?.id;
      const orderConfirmationUrl: OrderConfirmationRoute = orderId
        ? `/order-confirmation?orderId=${orderId}`
        : "/order-confirmation";
      router.push(orderConfirmationUrl);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Óvænt villa kom upp á greiðsluferlinu.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-white/10 bg-white/[.04] p-8 text-white"
    >
      <div>
        <h2 className="text-2xl font-semibold">Greiðsluferli</h2>
        <p className="mt-2 text-sm text-white/60">
          Sláðu inn greiðslu- og sendingarupplýsingar og við bætum til pöntun í
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
                required={["first_name", "last_name", "email", "address_1", "postcode"].includes(
                  key,
                )}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
              />
            </label>
          );
        })}
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Sendingarmáti
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {shippingRates.length === 0 ? (
            <button
              type="button"
              onClick={() => void loadShippingRates()}
              disabled={shippingLoading}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-white/30 disabled:cursor-not-allowed"
            >
              {shippingLoading ? "Sæki sendingarmáta..." : "Sækja sendingarleiðir"}
            </button>
          ) : (
            shippingRates.map((rate) => {
              const isSelected = rate.id === selectedShippingId;
              return (
                <label
                  key={rate.id}
                  className={`flex cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-3 transition ${
                    isSelected
                      ? "border-emerald-300/80 bg-emerald-300/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      value={rate.id}
                      checked={isSelected}
                      onChange={() => setSelectedShippingId(rate.id)}
                      className="h-4 w-4 accent-emerald-300"
                    />
                    <div>
                      <p className="font-semibold text-white">{rate.label}</p>
                      <p className="text-sm text-white/60">
                        {formatCurrency(rate.cost ?? 0)}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Greiðslumáti
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => {
            const isSelected = method.id === paymentMethod;
            return (
              <label
                key={method.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-3 transition ${
                  isSelected
                    ? "border-emerald-300/80 bg-emerald-300/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => setPaymentMethod(method.id)}
                    className="h-4 w-4 accent-emerald-300"
                  />
                  <div>
                    <p className="font-semibold text-white">{method.title}</p>
                    {method.description ? (
                      <p className="text-sm text-white/60">
                        {method.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
        <div>
          <p className="text-sm text-white/60">Upphæð til greiðslu</p>
          <p className="text-2xl font-semibold">
            {formatCurrency((subtotal || 0) + (selectedShippingCost || 0))}
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
          Pöntun hefur verið stofnuð! Skoðaðu WooCommerce stjórnborðið til að sjá
          nýju færsluna.
        </p>
      ) : null}
    </form>
  );
}
