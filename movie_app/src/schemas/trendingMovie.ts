import { z } from "zod";

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable().optional(), // TMDB sometimes returns null
  genre_ids: z.array(z.number()),
  id: z.number(),
  media_type: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable().optional(),
  release_date: z.string(), // You can use z.string().date() if you ensure correct format
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const TrendingMoviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type Movie = z.infer<typeof MovieSchema>;
export type TrendingMoviesResponse = z.infer<
  typeof TrendingMoviesResponseSchema
>;

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const GenresResponseSchema = z.object({
  genres: z.array(GenreSchema),
});

export const CastSchema = z.object({
  adult: z.boolean(),
  gender: z.number(),
  id: z.number(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(), // IMPORTANT: can be null
  cast_id: z.number(),
  character: z.string(),
  credit_id: z.string(),
  order: z.number(),
});

export const MovieCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(CastSchema),
});

export type Cast = z.infer<typeof CastSchema>;
export type MovieCredits = z.infer<typeof MovieCreditsSchema>;

export const TvShowSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  first_air_date: z.string(), // TMDB gives YYYY-MM-DD or empty string
  genre_ids: z.array(z.number()),
  id: z.number(),
  media_type: z.literal("tv"),
  name: z.string(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_name: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const TvShowsResponseSchema = z.object({
  page: z.number(),
  results: z.array(TvShowSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TvShow = z.infer<typeof TvShowSchema>;
export type TvShowsResponse = z.infer<typeof TvShowsResponseSchema>;
