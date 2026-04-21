import { Link } from 'react-router-dom';
import { Film, TrendingUp } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { getContentDetailsPath } from '@/lib/contentRoutes';
import { getAssetUrl } from '@/lib/assetUrl';
import { PosterCard } from '@/components/PosterCard';
import { SectionHeader } from '@/components/SectionHeader';
import { HeroCarousel } from '@/components/HeroCarousel';

export default function Homepage() {
  const { allContent, movies, tvShows, genres } = useAppData();

  const popular = [...allContent].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const featured = allContent.slice(0, 4);
  const topMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const topShows = [...tvShows].sort((a, b) => b.rating - a.rating).slice(0, 8);

  // Pick 4 posters for the hero grid
  const heroPosters = popular.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Ambient blurred backdrops from poster colours */}
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-1/4 -left-1/4 w-[55vw] h-[55vw] rounded-full opacity-25 blur-[100px] saturate-150">
            {heroPosters[0] && (
              <img
                src={getAssetUrl(heroPosters[0].poster)}
                className="w-full h-full object-cover rounded-full"
                alt=""
              />
            )}
          </div>
          <div className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[55vw] rounded-full opacity-20 blur-[100px] saturate-150">
            {heroPosters[1] && (
              <img
                src={getAssetUrl(heroPosters[1].poster)}
                className="w-full h-full object-cover rounded-full"
                alt=""
              />
            )}
          </div>
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <div className="max-w-[1360px] mx-auto px-6 lg:px-10 pt-14 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-center gap-12 xl:gap-16">
            {/* ── Left: Copy ─────────────────────────────────────── */}
            <div>
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-strong text-eyebrow mb-7 animate-fade-up">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-green-500 animate-dot-pulse flex-shrink-0"
                  aria-hidden="true"
                />
                Now tracking · {allContent.length}+ titles
              </div>

              <h1 className="font-bold text-[clamp(44px,6.5vw,88px)] leading-[0.96] tracking-tight mb-5 animate-fade-up animation-delay-100">
                Every film
                <br />
                worth{' '}
                <em className="not-italic text-primary">
                  remembering.
                </em>
              </h1>

              <p className="text-lg leading-relaxed text-muted-foreground max-w-[520px] mb-8 animate-fade-up animation-delay-200">
                Your personal cinema archive — track what you've watched, what
                you'll watch next, and what you almost forgot. Built for the
                obsessed.
              </p>

              <div className="flex flex-wrap gap-3 animate-fade-up animation-delay-300">
                <Link to="/browse">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                  >
                    <Film className="h-4 w-4" aria-hidden="true" />
                    Start your watchlist
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent text-foreground text-sm font-medium border border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    See how it works
                  </button>
                </Link>
              </div>
            </div>

            {/* ── Right: Staggered poster grid ────────────────── */}
            <div className="hidden lg:block relative h-[520px] animate-fade-up animation-delay-200">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4">
                {/* Col 1, rows 1-2 — tall, slightly lower */}
                <div className="row-span-2 translate-y-6">
                  {heroPosters[0] && (
                    <Link
                      to={getContentDetailsPath(heroPosters[0])}
                      className="block h-full rounded-2xl overflow-hidden shadow-2xl hover:-translate-y-1 hover:shadow-[0_24px_48px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 group"
                    >
                      <img
                        src={getAssetUrl(heroPosters[0].poster)}
                        alt={heroPosters[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  )}
                </div>

                {/* Col 2-3, row 1 — wide landscape */}
                <div className="col-span-2 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {heroPosters[1] && (
                    <Link to={getContentDetailsPath(heroPosters[1])} className="block h-full">
                      <img
                        src={getAssetUrl(heroPosters[1].poster)}
                        alt={heroPosters[1].title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  )}
                </div>

                {/* Col 2, row 2 */}
                <div className="rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {heroPosters[2] && (
                    <Link to={getContentDetailsPath(heroPosters[2])} className="block h-full">
                      <img
                        src={getAssetUrl(heroPosters[2].poster)}
                        alt={heroPosters[2].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  )}
                </div>

                {/* Col 3, row 2 */}
                <div className="rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  {heroPosters[3] && (
                    <Link to={getContentDetailsPath(heroPosters[3])} className="block h-full">
                      <img
                        src={getAssetUrl(heroPosters[3].poster)}
                        alt={heroPosters[3].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  )}
                </div>
              </div>

              {/* Stats widget — bottom right */}
              <div className="absolute -bottom-6 -right-4 z-10 flex items-center gap-0 rounded-2xl glass-strong shadow-xl animate-fade-up animation-delay-400 overflow-hidden">
                {[
                  { value: allContent.length, label: 'Titles' },
                  { value: genres.length, label: 'Genres' },
                  { value: movies.length + tvShows.length, label: 'Items' },
                ].map((stat, i, arr) => (
                  <div key={stat.label} className="flex items-stretch">
                    <div className="flex flex-col items-center px-5 py-4">
                      <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                        {stat.value}
                      </span>
                      <span className="text-eyebrow mt-0.5">{stat.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px bg-border/60 self-stretch my-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10 pb-24 space-y-20">

        {/* Most Popular — Carousel */}
        <section>
          <SectionHeader
            eyebrow="The Pulse · Updated hourly"
            title="Most popular this week"
            actionLabel="See all trending"
            actionHref="/browse"
          />
          <HeroCarousel items={popular} />
        </section>

        {/* Featured Content — 4-col grid */}
        <section>
          <SectionHeader
            eyebrow="Editor's Selection"
            title="Featured content"
            actionLabel="View all"
            actionHref="/browse"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {featured.map((item) => (
              <PosterCard key={item.id} item={item} showHoverInfo />
            ))}
          </div>
        </section>

        {/* Top Movies — horizontal scroll */}
        <section>
          <SectionHeader
            eyebrow="By critic score"
            title="Top movies"
            actionLabel="View all films"
            actionHref="/browse"
          />
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
            {topMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-[160px] md:w-[185px] snap-start">
                <PosterCard item={movie} showHoverInfo />
              </div>
            ))}
          </div>
        </section>

        {/* Top TV Shows — horizontal scroll */}
        <section>
          <SectionHeader
            eyebrow="Binge-worthy"
            title="Top TV shows"
            actionLabel="View all series"
            actionHref="/browse"
          />
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-2 px-2">
            {topShows.map((show) => (
              <div key={show.id} className="flex-none w-[160px] md:w-[185px] snap-start">
                <PosterCard item={show} showHoverInfo />
              </div>
            ))}
          </div>
        </section>

        {/* CTA — glass section */}
        <section>
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-14">
            {/* Subtle radial gradient accent */}
            <div
              className="absolute inset-0 -z-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 75% 20%, hsl(var(--primary)/0.15), transparent 55%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
              {/* Copy */}
              <div>
                <p className="text-eyebrow mb-3">Ready when you are</p>
                <h2 className="text-3xl md:text-[40px] font-bold tracking-tight leading-tight mb-4">
                  Turn watching into
                  <br />a habit worth keeping.
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-7 max-w-[500px]">
                  Build your personal watchlist, keep track of what you've seen,
                  and discover what to queue next — all in one place.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/register">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                    >
                      Create free account
                    </button>
                  </Link>
                  <Link to="/browse">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-foreground text-sm font-medium border border-border hover:bg-muted transition-colors cursor-pointer"
                    >
                      Browse without signup
                    </button>
                  </Link>
                </div>
              </div>

              {/* Mini poster grid */}
              <div className="hidden lg:grid grid-cols-2 gap-3">
                {allContent.slice(5, 9).map((item) => (
                  <PosterCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
