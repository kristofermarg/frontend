export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Tactica. Öll réttindi áskilin.</p>
        <p className="text-white/40">
          Hröð headless vefverslun knúin WooCommerce og Next.js.
        </p>
      </div>
    </footer>
  );
}
