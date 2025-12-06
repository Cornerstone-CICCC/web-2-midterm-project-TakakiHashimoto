import {
  GenresResponseSchema,
  MovieCreditsSchema,
  MovieSchema,
  TrendingMoviesResponseSchema,
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
  return trendingTvShows;
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

async function getActors(movie_id: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movie_id}/credits`,
    header
  );
  const actorData = await res.json();
  return MovieCreditsSchema.parse(actorData);
}

export {
  getTrendingMovies,
  getGenre,
  getTrendingTvShows,
  getTvGenre,
  searchMovie,
  getActors,
};
