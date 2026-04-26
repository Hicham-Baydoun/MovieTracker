// Auto-advancing carousel: blurred backdrop, text left, tilted poster right, progress bars.
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Plus, Check, Play } from 'lucide-react';
import type { Movie, TVShow } from '@/context/AppDataContext';
import { getContentDetailsPath } from '@/lib/contentRoutes';
import { getAssetUrl } from '@/lib/assetUrl';
import { useAppData } from '@/context/AppDataContext';

type ContentItem = Movie | TVShow;

// Duration each slide stays visible before auto-advancing (ms)
const SLIDE_DURATION = 5000;

interface HeroCarouselProps {
  items: ContentItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [idx, setIdx] = useState(0);
  const [pct, setPct] = useState(0);
  const { currentUser, toggleWatchlist } = useAppData();
  const navigate = useNavigate();

  // Negative wrap so prev on slide 0 goes to last slide
  const go = useCallback(
    (n: number) => {
      setIdx(((n % items.length) + items.length) % items.length);
      setPct(0);
    },
    [items.length]
  );

  // 60ms tick drives progress bar; resets on every slide change.
  useEffect(() => {
    if (!items.length) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setPct(progress);
      if (elapsed >= SLIDE_DURATION) {
        setIdx((i) => (i + 1) % items.length);
        setPct(0);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [idx, items.length]);

  if (!items.length) return null;

  const item = items[idx];
  const isInWatchlist = currentUser?.watchlist.includes(item.id) ?? false;

  const handleWatchlist = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    toggleWatchlist(item.id);
  };

  const meta =
    item.type === 'movie'
      ? item.duration
      : `${item.seasons} Season${item.seasons !== 1 ? 's' : ''} · ${item.episodes} Episodes`;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-card border border-border/30 shadow-2xl">
      {/* Layered blurred backdrops — one per slide, fades on transition */}
      {items.map((it, i) => (
        <div
          key={it.id}
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={getAssetUrl(it.poster)}
            alt=""
            className="w-full h-full object-cover scale-105 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/65 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-6 px-8 md:px-12 pt-10 pb-6 min-h-[360px] md:min-h-[420px]">
        {/* Left — text info */}
        <div className="text-white max-w-2xl">
          <p className="text-eyebrow text-white/55 mb-3">
            {item.genre.slice(0, 2).join(' · ')} &nbsp;·&nbsp;{' '}
            {item.type === 'movie' ? 'Film' : 'Series'}
          </p>

          <h2 className="text-3xl md:text-[2.75rem] font-bold leading-tight tracking-tight mb-3 line-clamp-2">
            {item.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-white/60 text-xs font-mono mb-4">
            <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
              <Star className="h-3.5 w-3.5 fill-yellow-400" aria-hidden="true" />
              <span className="tabular-nums">{item.rating}</span>
            </span>
            <span className="tabular-nums">{item.year}</span>
            <span>{meta}</span>
          </div>

          <p className="text-white/75 text-[15px] leading-relaxed mb-6 line-clamp-3 max-w-lg">
            {item.synopsis}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={getContentDetailsPath(item)}>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                View Details
              </button>
            </Link>
            <button
              type="button"
              onClick={handleWatchlist}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Right — tilted poster (desktop only) */}
        <div className="hidden lg:block w-[180px] xl:w-[210px] flex-shrink-0">
          <Link to={getContentDetailsPath(item)}>
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 hover:scale-105 transition-transform duration-300">
              <img
                src={getAssetUrl(item.poster)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* Progress bar row + controls */}
      <div className="relative z-10 flex items-center gap-4 px-8 md:px-12 pb-7 pt-2">
        {/* Progress bars */}
        <div className="flex-1 flex gap-1.5 h-[3px]" role="tablist" aria-label="Carousel slides">
          {items.map((it, i) => {
            const fill = i === idx ? pct : i < idx ? 100 : 0;
            return (
              <div
                key={it.id}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Slide ${i + 1}: ${it.title}`}
                className="flex-1 h-full rounded-full bg-white/20 relative overflow-hidden cursor-pointer"
                onClick={() => go(i)}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{ width: `${fill}%`, transition: fill === 0 ? 'none' : 'width 75ms linear' }}
                />
              </div>
            );
          })}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
