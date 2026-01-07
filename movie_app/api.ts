import {
  GenresResponseSchema,
  MovieCreditsSchema,
  TrendingMoviesResponseSchema,
  TvShowsResponseSchema,
} from "./src/schemas/trendingMovie";

const API_KEY = import.meta.env.VITE_API_KEY;
const header = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

async function searchById(id: number) {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  const res = await fetch(url, header);
  const searchedMovie = await res.json();
  return searchedMovie;
}

async function getTrendingMovies() {
  const url = "https://api.themoviedb.org/3/trending/movie/day";
  const res = await fetch(url, header);
  const trendingMovie = await res.json();
  console.log(trendingMovie);
  return TrendingMoviesResponseSchema.parse(trendingMovie);
}

async function getTrendingTvShows() {
  const url = "https://api.themoviedb.org/3/trending/tv/day";
  const res = await fetch(url, header);
  const trendingTvShows = await res.json();
  console.log(trendingTvShows);
  return TvShowsResponseSchema.parse(trendingTvShows);
}

async function getGenre() {
  const res = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list",
    header
  );

  const genreData = await res.json();
  console.log(genreData);
  return GenresResponseSchema.parse(genreData);
}

async function getTvGenre() {
  const res = await fetch("https://api.themoviedb.org/3/genre/tv/list", header);
  const tvGenre = await res.json();
  return tvGenre;
}

async function searchMovie(id: number) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, header);
  const searchResult = await res.json();
  console.log(searchResult);
  return searchResult;
}

async function searchShows(id: number) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}`, header);
  const searchResult = await res.json();
  console.log(searchResult);
  return searchResult;
}

async function getActors(movie_id: number, category: string) {
  const res = await fetch(
    category === "movie"
      ? `https://api.themoviedb.org/3/movie/${movie_id}/credits`
      : `https://api.themoviedb.org/3/tv/${movie_id}/credits`,
    header
  );
  const actorData = await res.json();
  return MovieCreditsSchema.parse(actorData);
}

async function searchMoviesByName(query: string, category: string) {
  const res = await fetch(
    category === "movie"
      ? `https://api.themoviedb.org/3/search/movie?query=${query}`
      : `https://api.themoviedb.org/3/search/tv?query=${query}`,
    header
  );
  const searchResult = await res.json();
  console.log(searchResult);
  return searchResult;
}

async function getTopMovies() {
  const results = [];

  for (let i = 1; i <= 5; i++) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=${i}&sort_by=vote_average.desc&vote_count.gte=1000;`,
      header
    );
    const result = await res.json();
    console.log(result);
    results.push(...result.results);
  }

  console.log(results);
  return results;
}

async function getTopShows() {
  const results = [];

  for (let i = 1; i <= 5; i++) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=true&language=en-US&page=${i}&sort_by=vote_average.desc&vote_count.gte=1000;`,
      header
    );
    const result = await res.json();

    results.push(...result.results);
  }
  console.log(results);
  return results;
}

async function sendLoginInfo(data: { email: string; password: string }) {
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseData = await response.json();
  return responseData;
}

async function sendSignin(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch("http://localhost:5000/api/signin", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const resData = res.json();
  return resData;
}

type watchlist = {
  movieId: number;
  title: string;
  release_year: string;
  poster: string;
};

async function addWatchlist({
  movieId,
  title,
  release_year,
  poster,
}: watchlist) {
  const res = await fetch("http://localhost:5000/api/watchlist", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId: movieId,
      title: title,
      release_year: release_year,
      poster: poster,
    }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data;
}
async function addWatched({ movieId, title, release_year, poster }: watchlist) {
  const res = await fetch("http://localhost:5000/api/watched", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movieId: movieId,
      title: title,
      release_year: release_year,
      poster: poster,
    }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data = await res.json();
  return data;
}

async function addFav({ movieId, title, release_year, poster }: watchlist) {
  const res = await fetch("http://localhost:5000/api/favorite", {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      movieId: movieId,
      title: title,
      release_year: release_year,
      poster: poster,
    }),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

type reviewType = {
  movieId: number;
  rating: number;
  thoughts: string;
  notes: string;
  title: string;
  release_year: string;
  poster: string;
};

async function addReview({
  movieId,
  rating,
  thoughts,
  notes,
  title,
  release_year,
  poster,
}: reviewType) {
  const res = await fetch("http://localhost:5000/api/review", {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      movieId: movieId,
      rating: rating,
      thoughts: thoughts,
      notes: notes,
      title: title,
      release_year: release_year,
      poster: poster,
    }),
  });

  if (!res.ok) {
    throw new Error();
  }

  return await res.json();
}

type rateType = {
  movieId: number;
  rating: number;
};

async function addRating({ movieId, rating }: rateType) {
  const res = await fetch("http://localhost:5000/api/rating", {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      movieId: movieId,
      rating: rating,
    }),
  });

  if (!res.ok) {
    throw new Error();
  }

  return await res.json();
}

async function getMe() {
  const res = await fetch("http://localhost:5000/api/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

async function getUserMovieData() {
  const res = await fetch("http://localhost:5000/api/movie", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}

async function logout() {
  const res = await fetch("http://localhost:5000/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Logout Faild");
  }

  return await res.json();
}

async function getReview() {
  const res = await fetch("http://localhost:5000/getreview", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
}
async function getWatchList() {
  const res = await fetch("http://localhost:5000/getWatchlist", {
    method: "GET",
    credentials: "include",

    headers: {
      "Content-type": "application/json",
    },
  });

  return await res.json();
}

async function getWatched() {
  const res = await fetch("http://localhost:5000/getWatched", {
    method: "GET",
    credentials: "include",

    headers: {
      "Content-type": "application/json",
    },
  });

  return await res.json();
}

async function getfav() {
  const res = await fetch("http://localhost:5000/getfav", {
    method: "GET",
    credentials: "include",

    headers: {
      "Content-type": "application/json",
    },
  });

  return await res.json();
}
export {
  getTrendingMovies,
  getGenre,
  getTrendingTvShows,
  getTvGenre,
  searchMovie,
  getActors,
  searchMoviesByName,
  searchShows,
  getTopMovies,
  getTopShows,
  sendLoginInfo,
  sendSignin,
  addWatchlist,
  addFav,
  getMe,
  logout,
  searchById,
  getWatchList,
  getWatched,
  getfav,
  getUserMovieData,
  addReview,
  addRating,
  getReview,
  addWatched,
};
