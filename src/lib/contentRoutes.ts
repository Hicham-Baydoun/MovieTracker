import type { Movie, TVShow } from '@/context/AppDataContext';

type ContentRouteInput = Pick<Movie, 'id' | 'type'> | Pick<TVShow, 'id' | 'type'>;

export function getContentDetailsPath(content: ContentRouteInput): string {
  return content.type === 'movie' ? `/movies/${content.id}` : `/shows/${content.id}`;
}
