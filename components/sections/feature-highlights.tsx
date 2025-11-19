const highlights = [
  {
    title: "Edge caching",
    description: "Leverages Next.js Route Handlers + WooCommerce REST caching.",
  },
  {
    title: "Modular UI",
    description: "Reusable product cards, hero sections, and checkout building blocks.",
  },
  {
    title: "Cart persistence",
    description: "Client-side cart provider keeps context synced between tabs.",
  },
  {
    title: "API ready",
    description: "Order creation flows through typed helper functions in utils.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {highlights.map((highlight) => (
        <article
          key={highlight.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80 transition hover:border-emerald-400/60 hover:bg-white/10"
        >
          <h3 className="text-lg font-semibold text-white">
            {highlight.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {highlight.description}
          </p>
        </article>
      ))}
    </section>
  );
}
