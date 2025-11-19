"use client";

import { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
