import { NextResponse } from "next/server";

import { createWooOrder } from "@/utils/woocommerce";
import type { CartShape } from "@/types/woocommerce";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CartShape;
    const order = await createWooOrder(payload);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create WooCommerce order.";

    return NextResponse.json({ message }, { status: 400 });
  }
}
