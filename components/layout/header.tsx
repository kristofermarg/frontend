import Image from "next/image";
import Link from "next/link";

import CartLink from "@/components/cart/cart-link";

const navItems = [
  { href: "/", label: "Heim" },
  { href: "/products", label: "Vefverslun" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="https://tactica.is/wp-content/uploads/2025/04/tactica_logo_hlid_hvitt_graent.png"
            alt="Tactica merki"
            width={140}
            height={32}
            className="h-8 w-auto"
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
        <CartLink />
      </div>
    </header>
  );
}
