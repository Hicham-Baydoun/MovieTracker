import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, TrendingUp, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppData } from '@/context/AppDataContext';
import { getContentDetailsPath } from '@/lib/contentRoutes';
import { getAssetUrl } from '@/lib/assetUrl';

export default function Homepage() {
  const { allContent, movies, tvShows } = useAppData();

  const featuredContent = allContent.slice(0, 4);
  const topMovies = movies.slice(0, 3);
  const topShows = tvShows.slice(0, 3);
  const popularContent = [...movies, ...tvShows].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (popularContent.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [popularContent.length]);

  const nextSlide = () => {
    if (popularContent.length === 0) {
      return;
    }
    setCurrentSlide((prev) => (prev + 1) % popularContent.length);
  };

  const prevSlide = () => {
    if (popularContent.length === 0) {
      return;
    }
    setCurrentSlide((prev) => (prev - 1 + popularContent.length) % popularContent.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={popularContent[0] ? getAssetUrl(popularContent[0].poster) : ''}
            alt=""
            className="w-full h-full object-cover blur-[60px] scale-150 opacity-60"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Track Your Favorite
              <span className="text-primary block mt-2">Movies & TV Shows</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover, organize, and keep track of all your favorite movies and TV shows in one place.
              Create your personal watchlist today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="w-full sm:w-auto">
                  <Film className="mr-2 h-5 w-5" />
                  Browse Movies
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Most Popular</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-background hover:bg-accent transition-colors"
                aria-label="Previous popular item"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-background hover:bg-accent transition-colors"
                aria-label="Next popular item"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {popularContent.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <Link to={getContentDetailsPath(item)}>
                    <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-xl">
                      <img
                        src={getAssetUrl(item.poster)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                            {item.type === 'movie' ? 'Movie' : 'TV Show'}
                          </span>
                          <span className="text-white/80 text-sm">{item.year}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-white font-medium">{item.rating}</span>
                          </div>
                          <span className="text-white/70">{item.genre.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
              {popularContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Content</h2>
            <Link to="/browse" className="flex items-center text-primary hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredContent.map((item) => (
              <Link key={item.id} to={getContentDetailsPath(item)}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={getAssetUrl(item.poster)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">{item.year}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.genre.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-accent/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top Movies</h2>
            <Link to="/browse" className="flex items-center text-primary hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMovies.map((movie) => (
              <Link key={movie.id} to={getContentDetailsPath(movie)}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="flex">
                    <div className="w-1/3 aspect-[2/3] overflow-hidden">
                      <img
                        src={getAssetUrl(movie.poster)}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{movie.director}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{movie.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {movie.synopsis}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top TV Shows</h2>
            <Link to="/browse" className="flex items-center text-primary hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topShows.map((show) => (
              <Link key={show.id} to={getContentDetailsPath(show)}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="flex">
                    <div className="w-1/3 aspect-[2/3] overflow-hidden">
                      <img
                        src={getAssetUrl(show.poster)}
                        alt={show.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2">{show.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{show.creator}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{show.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {show.seasons} Seasons | {show.episodes} Episodes
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of movie and TV show enthusiasts. Create your free account today!
          </p>
          <Link to="/register">
            <Button size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
