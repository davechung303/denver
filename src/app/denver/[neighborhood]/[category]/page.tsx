import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEIGHBORHOODS, CATEGORIES, getNeighborhood, getCategory } from "@/lib/neighborhoods";
import { getPlaces } from "@/lib/places";
import { getVideosForPage } from "@/lib/youtube";
import PlaceCard from "@/components/PlaceCard";
import VideoCard from "@/components/VideoCard";

export const revalidate = 86400; // ISR: revalidate every 24 hours

interface Props {
  params: Promise<{ neighborhood: string; category: string }>;
}

export async function generateStaticParams() {
  return NEIGHBORHOODS.flatMap((n) =>
    CATEGORIES.map((c) => ({ neighborhood: n.slug, category: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighborhood: nSlug, category: cSlug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) return {};

  const title = `Best ${c.name} in ${n.name}, Denver`;
  const description = `Find the best ${c.name.toLowerCase()} in ${n.name} (${n.tagline}), Denver. Local picks, Google ratings, and real recommendations from someone who actually lives here.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}`,
    },
    alternates: {
      canonical: `https://davelovesdenver.com/denver/${nSlug}/${cSlug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { neighborhood: nSlug, category: cSlug } = await params;
  const n = getNeighborhood(nSlug);
  const c = getCategory(cSlug);
  if (!n || !c) notFound();

  const otherCategories = CATEGORIES.filter((cat) => cat.slug !== cSlug);
  const [places, videos] = await Promise.all([
    getPlaces(nSlug, cSlug),
    getVideosForPage(nSlug, cSlug, 3),
  ]);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href={`/denver/${nSlug}`} className="hover:text-foreground transition-colors">{n.name}</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{c.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-denver-amber text-sm font-semibold uppercase tracking-widest mb-2">
          {n.name} &middot; {n.tagline}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          Best {c.name} in {n.name}
        </h1>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          Local picks for the best {c.name.toLowerCase()} in {n.name}, Denver — with live Google ratings,
          hours, and real recommendations.
        </p>
      </section>

      {/* Other categories in this neighborhood */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/denver/${nSlug}/${cat.slug}`}
              className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-denver-amber hover:text-slate-900 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Business listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {places.length > 0 ? (
          <>
            <p className="text-sm text-slate-400 mb-6">
              {places.length} places found · Rated by Google
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.place_id}
                  place={place}
                  neighborhoodSlug={nSlug}
                  categorySlug={cSlug}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-slate-400 py-16">
            No listings found. Check back soon.
          </p>
        )}
      </section>

      {/* YouTube Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold">{c.name} Videos from {n.name}</h2>
            <a
              href="https://youtube.com/davechung"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-denver-amber hover:underline"
            >
              See all &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} neighborhood={n.name} category={c.name} />
            ))}
          </div>
        </div>
      </section>

      {/* Back to neighborhood */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/denver/${nSlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-denver-amber hover:underline"
        >
          &larr; Back to {n.name} neighborhood guide
        </Link>
      </div>
    </>
  );
}
