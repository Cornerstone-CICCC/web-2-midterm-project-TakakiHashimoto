// This Route is logged in only
// Fetch user data from backend
// Fetch their associated movie data from my backend
// need to make api requests to the tmdb in order to fetch movie data or tv show data

// get the all tmdb id from movies tables assocaiated with logged-in user
// search the movies in tmdb and returns
// display the data
// get the movie id where watclist = true and search those movies

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getfav, getReview, getWatched, getWatchList } from "../../api";
// import { useEffect, useState } from "react";
import { StatCard } from "../components/StatCard";
import { PosterCard } from "../components/PosterCard";
import { WatchlistRow } from "../components/WatchlistRow";
import { Link } from "react-router-dom";

type Movie = {
  tmdb_id: number;
  title: string;
  poster: string;
  watched: boolean;
  favorite: boolean;
  watchlist: boolean;
};

type Review = {
  tmdb_id: number;
  title: string;
  poster: string;
  rating: number;
  thoughts: string;
  notes: string;
};

function DashBoard() {
  const { user } = useAuth();

  // movies.tmdb_id, movies.poster, movies.title, watchlists.watched, watchlists.favorite,watchlists.watchlist

  const { data: watchedData } = useQuery<Movie[]>({
    queryKey: ["watched", user?.id],
    queryFn: () => {
      return getWatched();
    },
    enabled: !!user,
  });

  const { data: watchlistData } = useQuery<Movie[]>({
    queryKey: ["watchlist", user?.id],
    queryFn: () => {
      return getWatchList();
    },
    enabled: !!user,
  });

  const { data: favData } = useQuery<Movie[]>({
    queryKey: ["fav", user?.id],
    queryFn: () => {
      return getfav();
    },
    enabled: !!user,
  });

  const { data: review } = useQuery<Review[]>({
    queryKey: ["review", user?.id],
    queryFn: () => getReview(),
  });

  return (
    <div className="mt-16 px-8 text-white overflow-y-auto h-[calc(100vh-5rem)] bg-gradient-to-br from-[#0f0f12] via-[#14141a]  to-[#09090b] text-white ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome Back, {user?.email}</h1>
        <p className="text-gray-400 mt-1">
          Here's your movie tracking dashboard.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Link to="/dashboard/watched">
          <StatCard title="Watched" value={watchedData?.length ?? 0} />
        </Link>
        <Link to="/dashboard/watchlist">
          <StatCard title="Watchlist" value={watchlistData?.length ?? 0} />
        </Link>
        <Link to="/dashboard/favorites">
          <StatCard title="Favorites" value={favData?.length ?? 0} />
        </Link>

        <Link to="/dashboard/review">
          <StatCard title="Reviews" value={review?.length ?? 0} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-[30vh]">
        {/* I want to have fixed heaight */}
        <section className="lg:col-span-2">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Recently Watched</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {watchedData?.length === 0 && (
              <p className="text-gray-400">No watched movies yet.</p>
            )}

            {watchedData?.map((movie) => (
              <PosterCard key={movie.tmdb_id} movie={movie} />
            ))}
          </div>
        </section>
        <section className="flex flex-col h-full">
          <div className="flex justify-between mb-4 shrink-0">
            <h2 className="text-xl font-semibold">Watchlist</h2>
          </div>

          <div className="space-y-3 overflow-y-scroll pr-2">
            {watchlistData?.length === 0 && (
              <p className="text-gray-400">Your watchlist is empty.</p>
            )}

            {watchlistData?.map((movie) => (
              <WatchlistRow key={movie.tmdb_id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export { DashBoard };
