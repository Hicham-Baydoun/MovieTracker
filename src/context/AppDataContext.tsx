import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Movie {
  id: string;
  tmdbId?: number;
  type: 'movie';
  title: string;
  year: number;
  genre: string[];
  rating: number;
  duration: string;
  director: string;
  cast: string[];
  synopsis: string;
  poster: string;
  createdBy?: string | null;
}

export interface TVShow {
  id: string;
  tmdbId?: number;
  type: 'show';
  title: string;
  year: number;
  genre: string[];
  rating: number;
  seasons: number;
  episodes: number;
  creator: string;
  cast: string[];
  synopsis: string;
  poster: string;
  createdBy?: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  watchlist: string[];
  joinedDate: string;
}

export type ContentItem = Movie | TVShow;
export type ContentType = ContentItem['type'];

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

export interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface AppDataContextValue {
  movies: Movie[];
  tvShows: TVShow[];
  genres: string[];
  allContent: ContentItem[];
  currentUser: User | null;
  loading: boolean;
  getContentById: (id: string) => ContentItem | undefined;
  addContent: (input: ContentInput) => Promise<ContentItem>;
  updateContent: (id: string, input: ContentInput) => Promise<ContentItem>;
  registerUser: (payload: RegisterPayload) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  toggleWatchlist: (contentId: string) => Promise<void>;
  removeFromWatchlist: (contentId: string) => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type RawDoc = Record<string, unknown>;

// MongoDB uses _id; we normalize to id so every component works the same way
function toContent(raw: RawDoc): ContentItem {
  const { _id, ...rest } = raw;
  return { id: _id as string, ...rest } as ContentItem;
}

// Same normalization for user documents
function toUser(raw: RawDoc): User {
  const { _id, ...rest } = raw;
  return { id: _id as string, ...rest } as User;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kick off content fetch and session restore at the same time so the app
  // doesn't wait on auth before showing the library. allSettled means one
  // failing (e.g. not logged in) won't block the other.
  useEffect(() => {
    async function init() {
      const [contentRes, authRes] = await Promise.allSettled([
        apiFetch<RawDoc[]>('/api/content'),
        apiFetch<{ user: RawDoc }>('/api/auth/me'),
      ]);

      if (contentRes.status === 'fulfilled') {
        setAllContent(contentRes.value.map(toContent));
      }
      if (authRes.status === 'fulfilled') {
        setCurrentUser(toUser(authRes.value.user));
      }

      setLoading(false);
    }
    init();
  }, []);

  const movies  = useMemo(() => allContent.filter((i): i is Movie  => i.type === 'movie'), [allContent]);
  const tvShows = useMemo(() => allContent.filter((i): i is TVShow => i.type === 'show'),  [allContent]);

  const genres = useMemo(() => {
    const all = allContent.flatMap(i => i.genre);
    return [...new Set(all)].sort();
  }, [allContent]);

  const getContentById = useCallback(
    (id: string) => allContent.find(i => i.id === id),
    [allContent],
  );

  // Sends the new item to the API and appends it to local state so the UI
  // updates immediately without a full refetch.
  const addContent = useCallback(async (input: ContentInput): Promise<ContentItem> => {
    const raw = await apiFetch<RawDoc>('/api/content', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    const item = toContent(raw);
    setAllContent(prev => [...prev, item]);
    return item;
  }, []);

  // Replaces the old entry in local state with the server's response so
  // optimistic and actual data stay in sync.
  const updateContent = useCallback(async (id: string, input: ContentInput): Promise<ContentItem> => {
    const raw = await apiFetch<RawDoc>(`/api/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    const item = toContent(raw);
    setAllContent(prev => prev.map(i => (i.id === id ? item : i)));
    return item;
  }, []);

  // Returns {success, message} instead of throwing so callers can show
  // inline form errors without a try/catch at every call site.
  const registerUser = useCallback(async (payload: RegisterPayload): Promise<AuthResult> => {
    try {
      const data = await apiFetch<{ user: RawDoc }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const user = toUser(data.user);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await apiFetch<{ user: RawDoc }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const user = toUser(data.user);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }, []);

  // The server clears the httpOnly cookie; we clear local state to match.
  const logout = useCallback(async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
  }, []);

  // One function handles both add and remove — checks the current list to
  // decide which verb to send so callers don't need to know the state.
  const toggleWatchlist = useCallback(async (contentId: string) => {
    if (!currentUser) return;
    const inList = currentUser.watchlist.includes(contentId);
    const method = inList ? 'DELETE' : 'POST';
    await apiFetch(`/api/users/watchlist/${contentId}`, { method });
    setCurrentUser(prev =>
      prev
        ? {
            ...prev,
            watchlist: inList
              ? prev.watchlist.filter(id => id !== contentId)
              : [...prev.watchlist, contentId],
          }
        : null,
    );
  }, [currentUser]);

  const removeFromWatchlist = useCallback(async (contentId: string) => {
    if (!currentUser) return;
    await apiFetch(`/api/users/watchlist/${contentId}`, { method: 'DELETE' });
    setCurrentUser(prev =>
      prev ? { ...prev, watchlist: prev.watchlist.filter(id => id !== contentId) } : null,
    );
  }, [currentUser]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      movies,
      tvShows,
      genres,
      allContent,
      currentUser,
      loading,
      getContentById,
      addContent,
      updateContent,
      registerUser,
      login,
      logout,
      toggleWatchlist,
      removeFromWatchlist,
    }),
    [movies, tvShows, genres, allContent, currentUser, loading, getContentById,
     addContent, updateContent, registerUser, login, logout, toggleWatchlist, removeFromWatchlist],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
