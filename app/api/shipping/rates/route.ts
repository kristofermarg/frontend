import { NextResponse } from "next/server";

type Body = {
  items: { product_id: number; quantity: number }[];
  address: {
    country?: string;
    city?: string;
    postcode?: string;
    address_1?: string;
    address_2?: string;
    state?: string;
  };
};

const getBackendUrl = () =>
  process.env.NEXT_PUBLIC_WP_URL ??
  process.env.WOOCOMMERCE_URL ??
  "https://backend.webdev.is";

const FREE_SHIPPING_LABEL =
  process.env.NEXT_PUBLIC_FREE_SHIPPING_LABEL ?? "Frí afhending";
const LOCAL_PICKUP_LABEL =
  process.env.NEXT_PUBLIC_LOCAL_PICKUP_LABEL ?? "Sækja í verslun";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const backendUrl = getBackendUrl();

    let postisRates: unknown[] = [];
    let warning: string | undefined;

    try {
      const response = await fetch(`${backendUrl}/wp-json/tactica/v1/postis-rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        postisRates = Array.isArray(data?.rates) ? data.rates : [];
      } else {
        warning = `Postis rates error: ${response.status} ${response.statusText}`;
      }
    } catch (err) {
      warning =
        err instanceof Error
          ? err.message
          : "Unable to reach Postis rate service.";
    }

    const fallbackRates = [
      {
        id: "free_shipping",
        method_id: "free_shipping",
        label: FREE_SHIPPING_LABEL,
        cost: 0,
        taxes: null,
        meta: null,
      },
      {
        id: "local_pickup",
        method_id: "local_pickup",
        label: LOCAL_PICKUP_LABEL,
        cost: 0,
        taxes: null,
        meta: null,
      },
    ];

    const mergedRates = [...postisRates, ...fallbackRates];

    return NextResponse.json(
      warning ? { rates: mergedRates, warning } : { rates: mergedRates },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch shipping rates at the moment.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
