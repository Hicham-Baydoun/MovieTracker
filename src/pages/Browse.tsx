import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, X, Film, Tv, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppData } from '@/context/AppDataContext';
import { getContentDetailsPath } from '@/lib/contentRoutes';
import { getAssetUrl } from '@/lib/assetUrl';

export default function Browse() {
  const { allContent, genres } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'show'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const filteredContent = useMemo(() => {
    return allContent.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((selectedGenre) => item.genre.includes(selectedGenre));

      const matchesType =
        selectedType === 'all' ||
        (selectedType === 'movie' && item.type === 'movie') ||
        (selectedType === 'show' && item.type === 'show');

      return matchesSearch && matchesGenre && matchesType;
    });
  }, [allContent, searchQuery, selectedGenres, selectedType]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedType('all');
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || selectedType !== 'all';
  const selectedGenresLabel =
    selectedGenres.length === 0
      ? 'All Genres'
      : selectedGenres.length === 1
        ? selectedGenres[0]
        : `${selectedGenres.length} genres selected`;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse Movies & TV Shows
          </h1>
          <p className="text-muted-foreground">
            Discover your next favorite movie or TV show from our collection.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 bg-accent/50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Genre
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        <span className="truncate">{selectedGenresLabel}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                      {genres.map((genre) => (
                        <DropdownMenuCheckboxItem
                          key={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => toggleGenre(genre)}
                          onSelect={(event) => event.preventDefault()}
                        >
                          {genre}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Content Type
                  </label>
                  <Select
                    value={selectedType}
                    onValueChange={(value: 'all' | 'movie' | 'show') => setSelectedType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="movie">Movies Only</SelectItem>
                      <SelectItem value="show">TV Shows Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredContent.length}</span> results
          </p>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedGenres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                >
                  Genre: {genre}
                  <button onClick={() => toggleGenre(genre)} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  Type: {selectedType === 'movie' ? 'Movies' : 'TV Shows'}
                  <button onClick={() => setSelectedType('all')} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map((item) => (
              <Link key={item.id} to={getContentDetailsPath(item)}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group h-full">
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img
                      src={getAssetUrl(item.poster)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-background/90 text-foreground">
                        {item.type === 'movie' ? (
                          <Film className="h-3 w-3 mr-1" />
                        ) : (
                          <Tv className="h-3 w-3 mr-1" />
                        )}
                        {item.type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                    </div>
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
                      {item.genre.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    {'duration' in item ? (
                      <p className="text-sm text-muted-foreground mt-2">{item.duration}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.seasons} Seasons
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
