import { Link } from 'react-router-dom';
import { Mail, Calendar, Film, LogIn, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppData } from '@/context/AppDataContext';
import { PosterCard } from '@/components/PosterCard';
import { SectionHeader } from '@/components/SectionHeader';

export default function Profile() {
  const { currentUser, getContentById, removeFromWatchlist } = useAppData();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Sign In Required</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">
            Please log in to view your profile and watchlist.
          </p>
          <Link to="/login">
            <Button size="lg" className="cursor-pointer shadow-sm">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const watchlistItems = currentUser.watchlist
    .map((id) => getContentById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  // 1–2 char initials for the avatar.
  const initials = currentUser.username
    .split(/[\s_-]/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('') || currentUser.username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">

        {/* Profile header card */}
        <Card className="mb-12 border-border/50 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-lg select-none"
                aria-hidden="true"
              >
                {initials}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {currentUser.username}
                </h1>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{' '}
                      {new Date(currentUser.joinedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Watchlist count stat */}
              <div className="flex flex-col items-center px-6 py-3.5 rounded-xl bg-primary/8 border border-primary/15 text-center flex-shrink-0">
                <BookMarked className="h-5 w-5 text-primary mb-1" aria-hidden="true" />
                <span className="text-2xl font-bold tabular-nums">{watchlistItems.length}</span>
                <span className="text-eyebrow mt-0.5">Watchlist</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watchlist section */}
        <SectionHeader
          eyebrow="Your collection"
          title={`My Watchlist (${watchlistItems.length})`}
          actionLabel={watchlistItems.length > 0 ? 'Browse more' : undefined}
          actionHref="/browse"
        />

        {watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {watchlistItems.map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onRemove={() => removeFromWatchlist(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Film className="h-9 w-9 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
              Start adding movies and TV shows to track what you want to watch.
            </p>
            <Link to="/browse">
              <Button size="lg" className="cursor-pointer shadow-sm">
                Browse Content
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
