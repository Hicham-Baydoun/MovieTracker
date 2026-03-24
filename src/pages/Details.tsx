import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Calendar, Clock, User, ArrowLeft, Plus, Check, Film, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const relatedContent = useMemo(() => {
    if (!content) {
      return [];
    }

    return allContent
      .filter((item) => {
        if (item.id === content.id) {
          return false;
        }
        if (requiredType && item.type !== requiredType) {
          return false;
        }
        return item.genre.some((genre) => content.genre.includes(genre));
      })
      .slice(0, 3);
  }, [allContent, content, requiredType]);

  if (!content || isWrongType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The {requiredType === 'movie' ? 'movie' : requiredType === 'show' ? 'TV show' : 'content'} you are looking for does not exist.
          </p>
          <Button onClick={() => navigate('/browse')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const synopsis = content.synopsis;
  const shouldTruncate = synopsis.length > 200;
  const displaySynopsis = showFullSynopsis ? synopsis : synopsis.slice(0, 200);
  const isInWatchlist = currentUser ? currentUser.watchlist.includes(content.id) : false;

  const onToggleWatchlist = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    toggleWatchlist(content.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              <img
                src={getAssetUrl(content.poster)}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="flex items-center">
                  {content.type === 'movie' ? <Film className="h-3 w-3 mr-1" /> : <Tv className="h-3 w-3 mr-1" />}
                  {content.type === 'movie' ? 'Movie' : 'TV Show'}
                </Badge>
                <span className="text-muted-foreground">{content.year}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{content.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center bg-yellow-500/10 px-4 py-2 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 mr-2" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{content.rating}</p>
                  <p className="text-xs text-muted-foreground">/10</p>
                </div>
              </div>
              <Button
                onClick={onToggleWatchlist}
                variant={isInWatchlist ? 'default' : 'outline'}
                className="flex items-center"
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

            <div className="flex flex-wrap gap-2">
              {content.genre.map((genre) => (
                <Link key={genre} to={`/browse?genre=${encodeURIComponent(genre)}`}>
                  <Badge variant="outline">{genre}</Badge>
                </Link>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Synopsis</h2>
              <p className="text-muted-foreground leading-relaxed">
                {displaySynopsis}
                {shouldTruncate && !showFullSynopsis && '...'}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullSynopsis((prev) => !prev)}
                  className="text-primary hover:underline mt-2 text-sm"
                >
                  {showFullSynopsis ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center">
                  <User className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {content.type === 'movie' ? 'Director' : 'Creator'}
                    </p>
                    <p className="font-medium text-foreground">
                      {content.type === 'movie' ? content.director : content.creator}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {content.type === 'movie' ? (
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{content.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seasons & Episodes</p>
                      <p className="font-medium text-foreground">
                        {content.seasons} Seasons, {content.episodes} Episodes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Cast</h2>
              <div className="flex flex-wrap gap-2">
                {content.cast.map((actor) => (
                  <Badge key={actor} variant="secondary">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {relatedContent.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedContent.map((item) => (
                <Link key={item.id} to={getContentDetailsPath(item)}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="flex">
                      <div className="w-1/3 aspect-[2/3] overflow-hidden">
                        <img
                          src={getAssetUrl(item.poster)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2">{item.title}</h3>
                        <div className="flex items-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.year}</p>
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
