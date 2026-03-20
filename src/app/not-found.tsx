import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-4">404</p>
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg mb-10">
        This page doesn&apos;t exist — but Denver definitely does. Start exploring below.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {NEIGHBORHOODS.slice(0, 8).map((n) => (
          <Link
            key={n.slug}
            href={`/denver/${n.slug}`}
            className="group relative overflow-hidden rounded-xl aspect-video flex items-end p-3 hover:scale-[1.02] transition-transform"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-90`} />
            <span className="relative z-10 text-white text-sm font-bold">{n.name}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-denver-amber text-slate-900 font-semibold px-6 py-3 rounded-full hover:bg-amber-400 transition-colors"
      >
        &larr; Back to homepage
      </Link>
    </section>
  );
}
