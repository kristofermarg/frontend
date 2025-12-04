export type CartItem = {
  productId: number;
  quantity: number;
};

export type ShippingAddress = {
  country: string;
  city: string;
  postcode: string;
  address_1?: string;
  address_2?: string;
  state?: string;
};

export type PostisRate = {
  id: string;
  method_id: string;
  label: string;
  cost: number;
  taxes: unknown;
  meta: unknown;
};

export async function fetchPostisRates(
  items: CartItem[],
  address: ShippingAddress,
) {
  const res = await fetch("/api/shipping/rates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
      })),
      address,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Postis rates error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.rates as PostisRate[];
}
