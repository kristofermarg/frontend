import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import CartLink from "@/components/cart/cart-link";
import ThemeToggle from "@/components/theme/theme-toggle";

const navItems: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Heim" },
  { href: "/products", label: "Vefverslun" },
];

export default function Header() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="https://tactica.is/wp-content/uploads/2025/04/tactica_logo_hlid_hvitt_graent.png"
            alt="Tactica merki"
            width={140}
            height={32}
            className="header-logo h-8 w-auto transition"
            priority
          />
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-white/70 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CartLink />
        </div>
      </div>
    </header>
  );
}
