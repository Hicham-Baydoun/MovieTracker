import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { PosterCard } from '@/components/PosterCard';

const MAX_GENRE_SELECTIONS = 2;

export default function Browse() {
  const { allContent, genres } = useAppData();
  const [searchParams] = useSearchParams();

  const initialGenre = searchParams.get('genre');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialGenre ? [initialGenre] : []
  );
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'show'>('all');
  const [showFilters, setShowFilters] = useState(Boolean(initialGenre));

  // Pre-select genre from URL param when navigating from a Details genre tag.
  useEffect(() => {
    const genre = searchParams.get('genre');
    if (genre) {
      setSelectedGenres([genre]);
      setShowFilters(true);
    }
  }, [searchParams]);

  const availableGenres = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    genres.forEach((g) => { if (!seen.has(g)) { seen.add(g); result.push(g); } });
    allContent.forEach((item) =>
      item.genre.forEach((g) => { if (!seen.has(g)) { seen.add(g); result.push(g); } })
    );
    return result;
  }, [allContent, genres]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) return prev.filter((g) => g !== genre);
      if (prev.length >= MAX_GENRE_SELECTIONS) return prev;
      return [...prev, genre];
    });
  };

  const filteredContent = useMemo(
    () =>
      allContent.filter((item) => {
        const matchesSearch =
          !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre =
          selectedGenres.length === 0 ||
          selectedGenres.every((g) => item.genre.includes(g));
        const matchesType =
          selectedType === 'all' ||
          (selectedType === 'movie' && item.type === 'movie') ||
          (selectedType === 'show' && item.type === 'show');
        return matchesSearch && matchesGenre && matchesType;
      }),
    [allContent, searchQuery, selectedGenres, selectedType]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedType('all');
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || selectedType !== 'all';
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedGenres.length,
    selectedType !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const selectedGenresLabel =
    selectedGenres.length === 0
      ? 'All Genres'
      : selectedGenres.length === 1
        ? selectedGenres[0]
        : `${selectedGenres.length} genres`;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-10">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Browse Movies & TV Shows
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Discover your next favourite from our collection.
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background shadow-sm"
                aria-label="Search movies and TV shows"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="h-11 sm:w-auto gap-2 shadow-sm cursor-pointer"
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 bg-primary-foreground/20 text-xs rounded-full px-1.5 py-0.5 font-semibold tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div
              id="filter-panel"
              className="p-5 bg-muted/50 border border-border/50 rounded-xl shadow-sm space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="genre-btn">
                    Genre
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id="genre-btn"
                        variant="outline"
                        className="w-full justify-between font-normal bg-background cursor-pointer"
                        aria-label={`Genre filter: ${selectedGenresLabel}`}
                      >
                        <span className="truncate">{selectedGenresLabel}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
                      {availableGenres.map((genre) => (
                        <DropdownMenuCheckboxItem
                          key={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={() => toggleGenre(genre)}
                          onSelect={(e) => e.preventDefault()}
                          disabled={
                            selectedGenres.length >= MAX_GENRE_SELECTIONS &&
                            !selectedGenres.includes(genre)
                          }
                        >
                          {genre}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Pick up to {MAX_GENRE_SELECTIONS} genres.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="type-select">
                    Content Type
                  </label>
                  <Select
                    value={selectedType}
                    onValueChange={(v: 'all' | 'movie' | 'show') => setSelectedType(v)}
                  >
                    <SelectTrigger id="type-select" className="bg-background">
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
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  size="sm"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Results count + active filter chips */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground text-base tabular-nums">
              {filteredContent.length}
            </span>{' '}
            results
          </p>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Chip onRemove={() => setSearchQuery('')}>&ldquo;{searchQuery}&rdquo;</Chip>
              )}
              {selectedGenres.map((g) => (
                <Chip key={g} onRemove={() => toggleGenre(g)}>{g}</Chip>
              ))}
              {selectedType !== 'all' && (
                <Chip onRemove={() => setSelectedType('all')}>
                  {selectedType === 'movie' ? 'Movies' : 'TV Shows'}
                </Chip>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {filteredContent.map((item) => (
              <PosterCard key={item.id} item={item} showHoverInfo />
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Search className="h-9 w-9 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Button onClick={clearFilters} variant="outline" className="cursor-pointer">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium border border-primary/20">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 hover:opacity-70 cursor-pointer"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
