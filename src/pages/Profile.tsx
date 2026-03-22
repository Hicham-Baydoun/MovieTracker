import { Link } from 'react-router-dom';
import { Mail, Calendar, Film, Star, Trash2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppData } from '@/context/AppDataContext';
import { getContentDetailsPath } from '@/lib/contentRoutes';

export default function Profile() {
  const { currentUser, getContentById, removeFromWatchlist } = useAppData();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center space-y-4">
            <LogIn className="h-12 w-12 mx-auto text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Sign In Required</h1>
            <p className="text-muted-foreground">
              Please log in to view your profile and watchlist.
            </p>
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const watchlistItems = currentUser.watchlist
    .map((id) => getContentById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {currentUser.username}
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {new Date(currentUser.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Film className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              My Watchlist ({watchlistItems.length})
            </h2>
          </div>

          {watchlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlistItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {item.type === 'movie' ? 'Movie' : 'TV Show'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Link to={getContentDetailsPath(item)}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromWatchlist(item.id)}
                        aria-label={`Remove ${item.title} from watchlist`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Your watchlist is empty
              </h3>
              <p className="text-muted-foreground mb-4">
                Start adding movies and TV shows to your watchlist.
              </p>
              <Link to="/browse">
                <Button>Browse Content</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
