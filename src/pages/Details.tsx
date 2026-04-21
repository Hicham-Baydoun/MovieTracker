import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Plus,
  Check,
  Film,
  Tv,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppData, type ContentType } from '@/context/AppDataContext';
import { getContentDetailsPath } from '@/lib/contentRoutes';
import { getAssetUrl } from '@/lib/assetUrl';

interface DetailsProps {
  requiredType?: ContentType;
}

export default function Details({ requiredType }: DetailsProps = {}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const { allContent, currentUser, getContentById, toggleWatchlist } = useAppData();

  const contentId = Number(id);
  const content = Number.isNaN(contentId) ? undefined : getContentById(contentId);
  const isWrongType = Boolean(content && requiredType && content.type !== requiredType);

  // Up to 3 items sharing a genre; filtered by type so movies only show related movies.
  const relatedContent = useMemo(() => {
    if (!content) return [];
    return allContent
      .filter((item) => {
        if (item.id === content.id) return false;
        if (requiredType && item.type !== requiredType) return false;
        return item.genre.some((genre) => content.genre.includes(genre));
      })
      .slice(0, 3);
  }, [allContent, content, requiredType]);

  if (!content || isWrongType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Content Not Found</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The{' '}
            {requiredType === 'movie'
              ? 'movie'
              : requiredType === 'show'
                ? 'TV show'
                : 'content'}{' '}
            you are looking for does not exist.
          </p>
          <Button onClick={() => navigate('/browse')} className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  // Truncate long synopses; user can expand inline.
  const synopsis = content.synopsis;
  const shouldTruncate = synopsis.length > 300;
  const displaySynopsis = showFullSynopsis ? synopsis : synopsis.slice(0, 300);
  const isInWatchlist = currentUser ? currentUser.watchlist.includes(content.id) : false;

  // Redirect to login if unauthenticated, otherwise toggle watchlist.
  const onToggleWatchlist = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    toggleWatchlist(content.id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic blurred backdrop section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-[600px]">
          <img
            src={getAssetUrl(content.poster)}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl scale-150 opacity-20 dark:opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 -ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Main grid: poster + info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 max-w-sm mx-auto lg:max-w-none">
                <img
                  src={getAssetUrl(content.poster)}
                  alt={`${content.title} poster`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type badge + year */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                  {content.type === 'movie' ? (
                    <Film className="h-3.5 w-3.5" />
                  ) : (
                    <Tv className="h-3.5 w-3.5" />
                  )}
                  {content.type === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                <span className="text-muted-foreground text-sm font-medium">{content.year}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                {content.title}
              </h1>

              {/* Rating + Watchlist CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2.5 rounded-xl">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-foreground tabular-nums">
                    {content.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
                <Button
                  onClick={onToggleWatchlist}
                  variant={isInWatchlist ? 'default' : 'outline'}
                  size="lg"
                  className="cursor-pointer shadow-sm"
                  aria-label={
                    isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
                  }
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {currentUser ? 'Add to Watchlist' : 'Sign In to Add'}
                    </>
                  )}
                </Button>
              </div>

              {/* Genre tags — link to Browse with pre-filter */}
              <div className="flex flex-wrap gap-2">
                {content.genre.map((genre) => (
                  <Link
                    key={genre}
                    to={`/browse?genre=${encodeURIComponent(genre)}`}
                    className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary font-medium border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                    aria-label={`Browse ${genre} content`}
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {content.type === 'movie' ? 'Director' : 'Creator'}
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {content.type === 'movie' ? content.director : content.creator}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {content.type === 'movie' ? (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold text-foreground text-sm">
                          {content.duration}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Seasons & Episodes</p>
                        <p className="font-semibold text-foreground text-sm">
                          {content.seasons} Seasons, {content.episodes} Episodes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Below-fold content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left col spacer to align with poster */}
          <div className="hidden lg:block" />

          {/* Synopsis + Cast */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {displaySynopsis}
                {shouldTruncate && !showFullSynopsis && '…'}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullSynopsis((prev) => !prev)}
                  className="text-primary hover:text-primary/80 transition-colors mt-2 text-sm font-medium cursor-pointer"
                >
                  {showFullSynopsis ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Cast */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Cast</h2>
              <div className="flex flex-wrap gap-2">
                {content.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1.5 rounded-full text-sm bg-muted text-foreground font-medium border border-border/50"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related content */}
        {relatedContent.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedContent.map((item) => (
                <Link key={item.id} to={getContentDetailsPath(item)} className="block">
                  <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group border-border/50 cursor-pointer">
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 overflow-hidden">
                        <img
                          src={getAssetUrl(item.poster)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ minHeight: '120px' }}
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="font-bold text-foreground line-clamp-2 text-sm leading-snug">
                          {item.title}
                        </h3>
                        <div className="flex items-center mt-2 gap-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold tabular-nums">{item.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.year}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.genre.slice(0, 1).map((g) => (
                            <span
                              key={g}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
