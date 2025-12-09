"use client";

import { ReactNode } from "react";

import { CartProvider } from "@/components/cart/cart-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
