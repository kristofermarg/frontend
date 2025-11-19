import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-900 px-8 py-14 text-white shadow-2xl sm:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,.25),_transparent_60%)]" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <p className="text-xs uppercase tracking-[0.6em] text-emerald-300/80">
            Hauslaus vefverslun á íslensku
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Opnaðu fallega búð sem fylgir hraða vörulínunnar þinnar.
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            WooCommerce og Next.js 16 sjá til þess að viðmótið sé hratt,
            öruggt og sveigjanlegt með stöðugri körfu og snöggri leiðsögn.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Skoða vörur
            </Link>
            <Link
              href="/cart"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:text-emerald-200"
            >
              Fara í körfu
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-lg lg:max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
            Af hverju hauslaust?
          </p>
          <ul className="space-y-3 text-sm text-white/80">
            <li>- Skyndilega uppfærð vörusíða með stigvaxandi endurhleðslu</li>
            <li>- API-tengingar með WooCommerce REST þjónustu</li>
            <li>- Bjartsýn körfustjórnun og vistun milli tækja</li>
          </ul>
          <span className="text-xs text-white/60">
            Allt efni er rendrað á þjóninum svo viðskiptavinir og leitarvélar
            sjá hraðustu útgáfuna í hvert skipti.
          </span>
        </div>
      </div>
    </section>
  );
}
