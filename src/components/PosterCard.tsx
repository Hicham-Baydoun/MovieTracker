// Reusable poster card: rating/type badges, hover synopsis, optional watchlist remove button.
import { Link } from 'react-router-dom';
import { Star, Film, Tv, Trash2 } from 'lucide-react';
import type { Movie, TVShow } from '@/data/mockData';
import { getContentDetailsPath } from '@/lib/contentRoutes';
import { getAssetUrl } from '@/lib/assetUrl';
import { cn } from '@/lib/utils';

type ContentItem = Movie | TVShow;

export interface PosterCardProps {
  item: ContentItem;
  className?: string;
  /** Show synopsis + full info on hover */
  showHoverInfo?: boolean;
  /** Show remove button (for watchlist) */
  onRemove?: () => void;
}

export function PosterCard({ item, className, showHoverInfo = false, onRemove }: PosterCardProps) {
  const meta =
    item.type === 'movie'
      ? item.duration
      : `${item.seasons}S · ${item.episodes}ep`;

  return (
    <Link
      to={getContentDetailsPath(item)}
      className={cn('block group cursor-pointer', className)}
      aria-label={`View details for ${item.title}`}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-muted shadow-card group-hover:shadow-card-hover group-hover:-translate-y-1 transition-all duration-300">
        {/* Poster image */}
        <img
          src={getAssetUrl(item.poster)}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Bottom gradient — always visible */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Type badge — top left */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
            {item.type === 'movie' ? (
              <Film className="h-2.5 w-2.5" aria-hidden="true" />
            ) : (
              <Tv className="h-2.5 w-2.5" aria-hidden="true" />
            )}
            {item.type === 'movie' ? 'Film' : 'Series'}
          </span>
        </div>

        {/* Rating badge — top right */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="tabular-nums">{item.rating}</span>
          </span>
        </div>

        {/* Bottom info — always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <p className="text-eyebrow text-white/55 mb-0.5">
            {item.genre[0]} · {item.year}
          </p>
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
            {item.title}
          </h3>
          <p className="text-white/50 text-[11px] mt-0.5 tabular-nums">{meta}</p>
        </div>

        {/* Hover synopsis overlay */}
        {showHoverInfo && (
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none"
            aria-hidden="true"
          >
            <p className="text-eyebrow text-white/50 mb-1">
              {item.genre.slice(0, 2).join(' · ')} · {item.year}
            </p>
            <h3 className="text-white font-bold text-sm leading-snug mb-2">{item.title}</h3>
            <p className="text-white/65 text-xs leading-relaxed line-clamp-4">{item.synopsis}</p>
          </div>
        )}

        {/* Remove from watchlist button */}
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive cursor-pointer z-10"
            aria-label={`Remove ${item.title} from watchlist`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </Link>
  );
}
