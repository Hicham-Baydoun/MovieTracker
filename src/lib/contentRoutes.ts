import type { Movie, TVShow } from '@/data/mockData';

type ContentRouteInput = Pick<Movie, 'id' | 'type'> | Pick<TVShow, 'id' | 'type'>;

export function getContentDetailsPath(content: ContentRouteInput): string {
  return content.type === 'movie' ? `/movies/${content.id}` : `/shows/${content.id}`;
}
