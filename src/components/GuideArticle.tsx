import Link from "next/link";
import SchemaMarkup from "@/components/SchemaMarkup";
import type { Guide } from "@/lib/guides";

function formatUpdated(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function GuideArticle({ guide }: { guide: Guide }) {
  const url = `https://davelovesdenver.com/denver/${guide.slug}`;

  return (
    <main>
      <SchemaMarkup
        breadcrumbs={[
          { name: "Home", url: "https://davelovesdenver.com" },
          { name: "Denver", url: "https://davelovesdenver.com/denver" },
          { name: guide.title, url },
        ]}
        article={{
          title: guide.title,
          slug: guide.slug,
          url,
          publishedAt: guide.updated,
          updatedAt: guide.updated,
          description: guide.metaDescription,
        }}
        faqs={guide.faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      {/* Header */}
      <header className="bg-denver-navy text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-5">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/denver" className="hover:text-white transition-colors">Denver</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80">{guide.title}</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{guide.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
            <span>
              By{" "}
              <Link href="/about" className="text-denver-amber hover:underline font-medium">
                Dave Chung
              </Link>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Updated <time dateTime={guide.updated}>{formatUpdated(guide.updated)}</time>
            </span>
          </div>

          <p className="mt-6 text-lg text-white/80 leading-relaxed">{guide.lede}</p>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {guide.sections.map((s) => (
          <section key={s.h2} className="mb-14">
            <h2 className="text-2xl font-bold mb-4 leading-snug">{s.h2}</h2>

            <p className="text-lg leading-relaxed border-l-4 border-denver-amber pl-5 py-1 text-slate-700 dark:text-slate-300">
              {s.answer}
            </p>

            {s.body?.map((p) => (
              <p key={p.slice(0, 40)} className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
                {p}
              </p>
            ))}

            {s.list && (
              <ul className="mt-5 space-y-2.5">
                {s.list.map((li) => (
                  <li key={li.slice(0, 40)} className="flex gap-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span aria-hidden="true" className="text-denver-amber mt-1 shrink-0">&bull;</span>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}

            {s.table && (
              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      {s.table.head.map((h) => (
                        <th key={h} className="text-left font-semibold px-4 py-3 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r) => (
                      <tr key={r[0]} className="border-t border-slate-100 dark:border-slate-800">
                        {r.map((c, i) => (
                          <td key={i} className={`px-4 py-3 align-top ${i === 0 ? "font-medium" : "text-slate-600 dark:text-slate-400"}`}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {/* FAQ */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-12">
          <h2 className="text-2xl font-bold mb-8">Common questions</h2>
          <div className="space-y-7">
            {guide.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold mb-2">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Back to the pillar — these pages are link sinks by design */}
        <section className="mt-14 rounded-2xl bg-slate-50 dark:bg-slate-900 p-7">
          <h2 className="text-lg font-bold mb-2">Still deciding where to book?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
            The full neighborhood breakdown covers who each part of Denver actually suits, what it costs,
            and who should skip it.
          </p>
          <Link
            href="/denver/where-to-stay"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-denver-amber hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Where to stay in Denver &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
