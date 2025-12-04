import Link from "next/link";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function OrderConfirmationPage({ searchParams }: Props) {
  const orderIdParam = searchParams.orderId;
  const orderId = Array.isArray(orderIdParam)
    ? orderIdParam[0]
    : orderIdParam ?? null;

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/[.04] p-8 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          Pöntun móttekin
        </p>
        <h1 className="text-3xl font-semibold text-white">Takk fyrir pöntunina</h1>
        {orderId ? (
          <p className="mt-2 text-white/70">Númer pöntunar: {orderId}</p>
        ) : (
          <p className="mt-2 text-white/70">
            Við höfum móttekið pöntunina þína og sendum þér staðfestingu á netfangið
            sem þú gafst upp.
          </p>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70">
        <p>Þú færð einnig staðfestingarpóst með upplýsingum um sendingu.</p>
        <p>Hafðu samband ef þú þarft að breyta eða bæta við upplýsingum.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Skoða fleiri vörur
        </Link>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
        >
          Til baka heim
        </Link>
      </div>
    </section>
  );
}
