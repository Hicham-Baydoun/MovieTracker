
export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  duration: string;
  director: string;
  cast: string[];
  synopsis: string;
  poster: string;
  type: 'movie';
}

export interface TVShow {
  id: number;
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
  type: 'show';
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string;
  watchlist: number[];
  joinedDate: string;
}

export const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 
  'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

export const movies: Movie[] = [
  {
    id: 1,
    title: 'The Space Odyssey',
    year: 2023,
    genre: ['Sci-Fi', 'Adventure'],
    rating: 8.5,
    duration: '2h 15m',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway'],
    synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: 'assets/images/movie1.jpg',
    type: 'movie'
  },
  {
    id: 2,
    title: 'Midnight Detective',
    year: 2022,
    genre: ['Crime', 'Mystery', 'Thriller'],
    rating: 7.8,
    duration: '1h 55m',
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Morgan Freeman'],
    synopsis: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
    poster: 'assets/images/movie2.jpg',
    type: 'movie'
  },
  {
    id: 3,
    title: 'Love in Paris',
    year: 2023,
    genre: ['Romance', 'Comedy'],
    rating: 7.2,
    duration: '1h 45m',
    director: 'Richard Curtis',
    cast: ['Emma Stone', 'Ryan Gosling'],
    synopsis: 'Two strangers meet in Paris and fall in love over a magical weekend.',
    poster: 'assets/images/movie3.jpg',
    type: 'movie'
  },
  {
    id: 4,
    title: 'Dragon Warrior',
    year: 2024,
    genre: ['Action', 'Fantasy'],
    rating: 8.0,
    duration: '2h 05m',
    director: 'Ang Lee',
    cast: ['Jet Li', 'Michelle Yeoh'],
    synopsis: 'A young warrior must master ancient martial arts to save his village from an evil warlord.',
    poster: 'assets/images/movie4.jpg',
    type: 'movie'
  },
  {
    id: 5,
    title: 'The Last Laugh',
    year: 2023,
    genre: ['Comedy', 'Drama'],
    rating: 7.5,
    duration: '1h 50m',
    director: 'Wes Anderson',
    cast: ['Bill Murray', 'Scarlett Johansson'],
    synopsis: 'A retired comedian returns to the stage for one final performance.',
    poster: 'assets/images/movie5.jpg',
    type: 'movie'
  }
];

export const tvShows: TVShow[] = [
  {
    id: 101,
    title: 'Stranger Mysteries',
    year: 2020,
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    rating: 8.7,
    seasons: 4,
    episodes: 34,
    creator: 'The Duffer Brothers',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard'],
    synopsis: 'When a young boy disappears, his mother and friends must confront terrifying supernatural forces.',
    poster: 'assets/images/show1.jpg',
    type: 'show'
  },
  {
    id: 102,
    title: 'Crown of Kings',
    year: 2019,
    genre: ['Fantasy', 'Drama', 'Action'],
    rating: 9.0,
    seasons: 3,
    episodes: 24,
    creator: 'George R.R. Martin',
    cast: ['Emilia Clarke', 'Kit Harington'],
    synopsis: 'Noble families fight for control of the Iron Throne in a medieval fantasy world.',
    poster: 'assets/images/show2.jpg',
    type: 'show'
  },
  {
    id: 103,
    title: 'Tech Revolution',
    year: 2022,
    genre: ['Drama', 'Thriller'],
    rating: 8.2,
    seasons: 2,
    episodes: 16,
    creator: 'Aaron Sorkin',
    cast: ['Michael Fassbender', 'Kate Winslet'],
    synopsis: 'The story of a tech startup that changed the world and the people behind it.',
    poster: 'assets/images/show3.jpg',
    type: 'show'
  },
  {
    id: 104,
    title: 'Laugh Track',
    year: 2021,
    genre: ['Comedy'],
    rating: 7.9,
    seasons: 5,
    episodes: 60,
    creator: 'Chuck Lorre',
    cast: ['Jim Parsons', 'Kaley Cuoco'],
    synopsis: 'A group of friends navigate life, love, and careers in New York City.',
    poster: 'assets/images/show4.jpg',
    type: 'show'
  },
  {
    id: 105,
    title: 'Dark Shadows',
    year: 2023,
    genre: ['Horror', 'Mystery', 'Thriller'],
    rating: 8.4,
    seasons: 1,
    episodes: 8,
    creator: 'Mike Flanagan',
    cast: ['Victoria Pedretti', 'Oliver Jackson-Cohen'],
    synopsis: 'A family moves into a haunted mansion with a dark and tragic history.',
    poster: 'assets/images/show5.jpg',
    type: 'show'
  }
];

export const users: User[] = [
  {
    id: 1,
    username: 'moviebuff',
    email: 'moviebuff@example.com',
    password: 'password123',
    avatar: 'assets/images/avatar1.jpg',
    watchlist: [1, 101, 3, 102],
    joinedDate: '2024-01-15'
  },
  {
    id: 2,
    username: 'seriesfan',
    email: 'seriesfan@example.com',
    password: 'password456',
    avatar: 'assets/images/avatar2.jpg',
    watchlist: [2, 103, 4],
    joinedDate: '2024-02-20'
  }
];

export const getAllContent = () => [...movies, ...tvShows];

export const getContentById = (id: number) => {
  return getAllContent().find(item => item.id === id);
};

export const getContentByType = (type: 'movie' | 'show') => {
  return type === 'movie' ? movies : tvShows;
};

export const searchContent = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return getAllContent().filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.genre.some(g => g.toLowerCase().includes(lowerQuery))
  );
};

export const filterByGenre = (genre: string) => {
  return getAllContent().filter(item => 
    item.genre.includes(genre)
  );
};

