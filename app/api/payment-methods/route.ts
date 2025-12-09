import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const runtime = "nodejs";

type PaymentGateway = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  method_description?: string;
  enabled?: boolean;
};

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL ?? "https://backend.webdev.is",
  consumerKey:
    process.env.WOOCOMMERCE_KEY ??
    "ck_87ca4def17199c4ee23697a35e982bd8058d0b52",
  consumerSecret:
    process.env.WOOCOMMERCE_SECRET ??
    "cs_acbe3c5c0038e31abf40e1b191c63e467b91dc6b",
  version: "wc/v3",
  queryStringAuth: true,
});

export async function GET() {
  try {
    const response = await api.get("payment_gateways", { per_page: 50 });
    const gateways: PaymentGateway[] = Array.isArray(response.data)
      ? (response.data as PaymentGateway[])
      : [];

    const payment_methods = gateways
      .filter((gateway) => gateway && gateway.enabled !== false)
      .map((gateway) => ({
        id: gateway.id,
        title: gateway.title ?? gateway.name ?? gateway.id,
        description:
          gateway.description ?? gateway.method_description ?? undefined,
      }));

    return NextResponse.json({ payment_methods });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Ekki tA3kst aAø sAÝkja greiAøslumA-ta.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
