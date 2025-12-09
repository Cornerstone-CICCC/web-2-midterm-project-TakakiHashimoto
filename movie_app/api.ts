import {
  GenresResponseSchema,
  MovieCreditsSchema,
  MovieSchema,
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
};
