import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  movies as seedMovies,
  tvShows as seedTvShows,
  users as seedUsers,
  genres as seedGenres,
  type Movie,
  type TVShow,
  type User,
} from '@/data/mockData';

type ContentItem = Movie | TVShow;
type ContentType = ContentItem['type'];

interface ContentInputBase {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  synopsis: string;
  poster: string;
  cast: string[];
}

interface MovieInput extends ContentInputBase {
  type: 'movie';
  duration: string;
  director: string;
}

interface ShowInput extends ContentInputBase {
  type: 'show';
  seasons: number;
  episodes: number;
  creator: string;
}

export type ContentInput = MovieInput | ShowInput;

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

interface StoredAppData {
  movies: Movie[];
  tvShows: TVShow[];
  users: User[];
  currentUserId: number | null;
}

interface AppDataContextValue {
  movies: Movie[];
  tvShows: TVShow[];
  users: User[];
  genres: string[];
  allContent: ContentItem[];
  currentUser: User | null;
  getContentById: (id: number) => ContentItem | undefined;
  addContent: (input: ContentInput) => ContentItem;
  updateContent: (id: number, input: ContentInput) => ContentItem | null;
  registerUser: (payload: RegisterPayload) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;
  toggleWatchlist: (contentId: number) => void;
  removeFromWatchlist: (contentId: number) => void;
}

const STORAGE_KEY = 'movie-tracker-app-data-v1';

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function cloneSeed<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeAssetPath(path: string): string {
  return path.replace(/^\/assets\/images\//, 'assets/images/');
}

function getDefaultState(): StoredAppData {
  return {
    movies: cloneSeed(seedMovies),
    tvShows: cloneSeed(seedTvShows),
    users: cloneSeed(seedUsers),
    currentUserId: null,
  };
}

function readStoredState(): StoredAppData {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }

  const fallback = getDefaultState();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<StoredAppData>;
    if (!Array.isArray(parsed.movies) || !Array.isArray(parsed.tvShows) || !Array.isArray(parsed.users)) {
      return fallback;
    }

    return {
      movies: (parsed.movies as Movie[]).map((movie) => ({
        ...movie,
        poster: normalizeAssetPath(movie.poster),
      })),
      tvShows: (parsed.tvShows as TVShow[]).map((show) => ({
        ...show,
        poster: normalizeAssetPath(show.poster),
      })),
      users: (parsed.users as User[]).map((user) => ({
        ...user,
        avatar: normalizeAssetPath(user.avatar),
      })),
      currentUserId:
        typeof parsed.currentUserId === 'number' || parsed.currentUserId === null
          ? parsed.currentUserId
          : null,
    };
  } catch {
    return fallback;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getNextContentId(movies: Movie[], tvShows: TVShow[]): number {
  const maxId = Math.max(
    0,
    ...movies.map((movie) => movie.id),
    ...tvShows.map((show) => show.id),
  );
  return maxId + 1;
}

function getNextUserId(users: User[]): number {
  return Math.max(0, ...users.map((user) => user.id)) + 1;
}

function createContent(input: ContentInput, id: number): ContentItem {
  if (input.type === 'movie') {
    const movie: Movie = {
      id,
      type: 'movie',
      title: input.title,
      year: input.year,
      genre: input.genre,
      rating: input.rating,
      synopsis: input.synopsis,
      poster: input.poster,
      cast: input.cast,
      duration: input.duration,
      director: input.director,
    };
    return movie;
  }

  const show: TVShow = {
    id,
    type: 'show',
    title: input.title,
    year: input.year,
    genre: input.genre,
    rating: input.rating,
    synopsis: input.synopsis,
    poster: input.poster,
    cast: input.cast,
    seasons: input.seasons,
    episodes: input.episodes,
    creator: input.creator,
  };
  return show;
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredAppData>(() => readStoredState());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const allContent = useMemo(() => [...state.movies, ...state.tvShows], [state.movies, state.tvShows]);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) ?? null,
    [state.currentUserId, state.users],
  );

  const value = useMemo<AppDataContextValue>(() => {
    const getContentById = (id: number) => allContent.find((item) => item.id === id);

    const addContent = (input: ContentInput): ContentItem => {
      const id = getNextContentId(state.movies, state.tvShows);
      const createdItem = createContent(input, id);

      if (createdItem.type === 'movie') {
        setState((prev) => ({ ...prev, movies: [...prev.movies, createdItem] }));
      } else {
        setState((prev) => ({ ...prev, tvShows: [...prev.tvShows, createdItem] }));
      }

      return createdItem;
    };

    const updateContent = (id: number, input: ContentInput): ContentItem | null => {
      const existingMovie = state.movies.find((movie) => movie.id === id);
      if (existingMovie) {
        if (input.type !== 'movie') {
          return null;
        }

        const nextMovie = createContent(input, id) as Movie;
        setState((prev) => ({
          ...prev,
          movies: prev.movies.map((movie) => (movie.id === id ? nextMovie : movie)),
        }));
        return nextMovie;
      }

      const existingShow = state.tvShows.find((show) => show.id === id);
      if (existingShow) {
        if (input.type !== 'show') {
          return null;
        }

        const nextShow = createContent(input, id) as TVShow;
        setState((prev) => ({
          ...prev,
          tvShows: prev.tvShows.map((show) => (show.id === id ? nextShow : show)),
        }));
        return nextShow;
      }

      return null;
    };

    const registerUser = (payload: RegisterPayload): AuthResult => {
      const normalizedPayloadEmail = normalizeEmail(payload.email);
      const normalizedUsername = payload.username.trim().toLowerCase();

      const emailExists = state.users.some(
        (user) => normalizeEmail(user.email) === normalizedPayloadEmail,
      );
      if (emailExists) {
        return { success: false, message: 'This email is already registered.' };
      }

      const usernameExists = state.users.some(
        (user) => user.username.trim().toLowerCase() === normalizedUsername,
      );
      if (usernameExists) {
        return { success: false, message: 'This username is already taken.' };
      }

      const nextUser: User = {
        id: getNextUserId(state.users),
        username: payload.username.trim(),
        email: payload.email.trim(),
        password: payload.password,
        avatar: state.users.length % 2 === 0 ? 'assets/images/avatar1.jpg' : 'assets/images/avatar2.jpg',
        watchlist: [],
        joinedDate: new Date().toISOString().slice(0, 10),
      };

      setState((prev) => ({ ...prev, users: [...prev.users, nextUser] }));
      return { success: true, user: nextUser };
    };

    const login = (email: string, password: string): AuthResult => {
      const matchedUser = state.users.find(
        (user) => normalizeEmail(user.email) === normalizeEmail(email) && user.password === password,
      );

      if (!matchedUser) {
        return { success: false, message: 'Invalid email or password.' };
      }

      setState((prev) => ({ ...prev, currentUserId: matchedUser.id }));
      return { success: true, user: matchedUser };
    };

    const logout = () => {
      setState((prev) => ({ ...prev, currentUserId: null }));
    };

    const toggleWatchlist = (contentId: number) => {
      setState((prev) => {
        if (prev.currentUserId === null) {
          return prev;
        }

        const nextUsers = prev.users.map((user) => {
          if (user.id !== prev.currentUserId) {
            return user;
          }

          const isSaved = user.watchlist.includes(contentId);
          return {
            ...user,
            watchlist: isSaved
              ? user.watchlist.filter((id) => id !== contentId)
              : [...user.watchlist, contentId],
          };
        });

        return { ...prev, users: nextUsers };
      });
    };

    const removeFromWatchlist = (contentId: number) => {
      setState((prev) => {
        if (prev.currentUserId === null) {
          return prev;
        }

        const nextUsers = prev.users.map((user) => {
          if (user.id !== prev.currentUserId) {
            return user;
          }

          return {
            ...user,
            watchlist: user.watchlist.filter((id) => id !== contentId),
          };
        });

        return { ...prev, users: nextUsers };
      });
    };

    return {
      movies: state.movies,
      tvShows: state.tvShows,
      users: state.users,
      genres: seedGenres,
      allContent,
      currentUser,
      getContentById,
      addContent,
      updateContent,
      registerUser,
      login,
      logout,
      toggleWatchlist,
      removeFromWatchlist,
    };
  }, [allContent, currentUser, state.movies, state.tvShows, state.users]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

export type { ContentItem, ContentType, AuthResult };

