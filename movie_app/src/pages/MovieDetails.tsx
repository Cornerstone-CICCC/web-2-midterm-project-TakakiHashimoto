// Here I want to do: display movie / tvShow details.
// If a user clicks button => backend handles authentication and if logged-in add database

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getActors,
  searchMovie,
  searchShows,
  addWatchlist,
  addFav,
  addWatched,
} from "../../api";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserMovieData } from "../../api";
// import { motion, AnimatePresence } from "framer-motion";

type Movie = {
  id: number;
  tmdb_id: number;
  watched: boolean;
  favorite: boolean;
  watchlist: boolean;
};

function MovieDetails() {
  const { id, category } = useParams();
  const movieId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["searchMovie", movieId],
    queryFn: () => {
      if (category === "movie") {
        return searchMovie(movieId);
      } else {
        return searchShows(movieId);
      }
    },
  });

  console.log("params:", { id, category });

  // movies.tmdb_id, watchlists.watched, watchlists.favorite,watchlists.watchlist
  const { data: userMovie } = useQuery({
    queryKey: ["userMovie", movieId, user?.id],
    queryFn: async () => {
      const movie = await getUserMovieData();
      const matchingMovie = movie.find(
        (movie: Movie) => movie.tmdb_id === data.id
      );
      return matchingMovie;
    },
    enabled: !!user && !!data,
  });

  const isInWatchlist = userMovie?.watchlist === true; // if watchlist is true, it is true else. stores "false"
  const favorited = userMovie?.favorite === true; // if favorited, stores true, else false
  const isInWatched = userMovie?.watched === true; // if watched, stores true, else false
  console.log("userMovie:", userMovie);
  console.log("favorited:", favorited);

  const queryClient = useQueryClient();

  const watchlistMutation = useMutation({
    mutationFn: addWatchlist, // try adding watchlist=true to database
    onSuccess: () => {
      // if seccuess, do what?
      console.log("Added to watchlist");
      queryClient.invalidateQueries({
        queryKey: ["userMovie", movieId, user?.id],
      });
    },
    onError: (error) => {
      // if backend returns error, get them back to login page or redirect back to homepage
      if (error.message.includes("401")) {
        navigate("/login");
      }
      console.log(error);
    },
  });

  const favMutation = useMutation({
    mutationFn: addFav, // try adding favorite=true to database
    onSuccess: () => {
      // if seccuess, do what?
      console.log("Added to favoritelist");
      queryClient.invalidateQueries({
        queryKey: ["userMovie", movieId, user?.id],
      });
    },
    onError: (error) => {
      // if backend returns error, get them back to login page or redirect back to homepage
      if (error.message.includes("401")) {
        navigate("/login");
      }
      console.log(error);
    },
  });

  const watchedMutation = useMutation({
    mutationFn: addWatched,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userMovie", movieId, user?.id],
      });
    },
    onError: (error) => {
      if (error.message.includes("401")) {
        navigate("/login");
      }
      console.log(error);
    },
  });

  const { data: actors } = useQuery({
    queryKey: ["actors", movieId],
    queryFn: () => getActors(movieId, category!),
  });

  const [showAll, setShowAll] = useState(false);
  const visibleActors = showAll ? actors?.cast : actors?.cast.slice(0, 4);

  function handleWatchlist() {
    if (!user) {
      navigate("/login");
      return;
    }
    watchlistMutation.mutate({
      movieId: data.id,
      title: category === "movie" ? data.title : data.name,
      release_year:
        category === "movie" ? data.release_date : data.first_air_date,
      poster: `https://image.tmdb.org/t/p/original${data.poster_path}`,
    });
  }

  function handleWatched() {
    if (!user) {
      navigate("/login");
      return;
    }
    watchedMutation.mutate({
      movieId: data.id,
      title: category === "movie" ? data.title : data.name,
      release_year:
        category === "movie" ? data.release_date : data.first_air_date,
      poster: `https://image.tmdb.org/t/p/original${data.poster_path}`,
    });
  }

  function handleFav() {
    if (!user) {
      navigate("/login");
      return;
    }
    favMutation.mutate({
      movieId: data.id,
      title: category === "movie" ? data.title : data.name,
      release_year:
        category === "movie" ? data.release_date : data.first_air_date,
      poster: `https://image.tmdb.org/t/p/original${data.poster_path}`,
    });
  }

  if (isLoading) return <p></p>;

  const bgUrl = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  return (
    <div className=" flex justify-center">
      <div
        className={`relative flex flex-col md:flex-row gap-8 w-full min-h-[70vh] md:h-screen bg-cover bg-center
                    px-5 md:px-8 pb-12 items-start md:items-end mt-16 md:mt-0`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="absolute inset-0 backdrop-blur-[0.3px]" />
        <div className="flex flex-col gap-5 z-10 text-white w-full md:w-1/2">
          {category === "movie" ? (
            <h1 className="text-2xl font-bold md:text-7xl">{data.title}</h1>
          ) : (
            <h1 className="text-2xl font-bold md:text-7xl">{data.name}</h1>
          )}
          <div className="flex flex-wrap gap-3 text-sm md:text-base w-[100%] mr-5">
            <p>⭐ {data.vote_average.toFixed(1)}</p>
            {category === "movie" ? (
              <p>
                {Math.floor(data.runtime / 60)} h {data.runtime % 60}m
              </p>
            ) : (
              <p>-</p>
            )}
            {data.genres.map(
              (genre: { id: number; name: string }, index: number) =>
                index === data.genres.length - 1 ? (
                  <p>{genre.name} </p>
                ) : (
                  <p>{genre.name} |</p>
                )
            )}
            {category === "movie" ? (
              <p>{data.release_date.split("-")[0]}</p>
            ) : (
              <p>{data.first_air_date.split("-")[0]}</p>
            )}
          </div>
          <p>{data.overview}</p>

          <div className="flex gap-3">
            <button
              className={`relative flex items-center justify-center gap-2
    px-7 py-3 rounded-2xl
    text-sm font-semibold
    transition-all duration-200
    active:scale-95
    disabled:opacity-60 disabled:cursor-not-allowed

    ${
      isInWatchlist
        ? "bg-emerald-600 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
        : "bg-blue-600 hover:bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.35)]"
    }`}
              onClick={handleWatchlist}
            >
              Watch List
              {isInWatchlist ? <span>✓</span> : <span> + </span>}
            </button>
            <button
              className={` relative flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60

    ${
      isInWatched
        ? "bg-emerald-600 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
        : "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.35)]"
    }`}
              onClick={handleWatched}
            >
              Mark as Watched {isInWatched ? <span>✓</span> : <span> + </span>}
            </button>

            <Link
              to={`/review/${data.id}`}
              state={{
                poster: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
                title: category === "movie" ? data.title : data.name,
                release_year:
                  category === "movie"
                    ? data.release_date
                    : data.first_air_date,
              }}
            >
              <button className=" px-7 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm shadow-[0_0_30px_rgba(250,204,21,0.45)] transition-all duration-200 active:scale-95">
                Add review +
              </button>
            </Link>
            <button
              onClick={handleFav}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-200 active:scale-90"
            >
              <span
                className={`text-2xl transition-transform ${
                  favorited ? "scale-110 text-pink-500" : "text-white"
                }`}
              >
                {favorited ? "♥" : "♡"}
              </span>
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-10 w-full md:w-[50%]">
          <h2 className="text-3xl mb-4">Actors</h2>
          <div className="relative">
            <div
              className="
                   flex gap-4 text-center overflow-x-auto pr-8 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent max-w-30%"
            >
              {visibleActors?.map((actor) => (
                <div key={actor.id} className="ml-5">
                  {actor.profile_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  )}

                  {actor.profile_path && <p>{actor.name}</p>}
                </div>
              ))}
              {!showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="flex-shrink-0 w-20 h-20 rounded-full bg-white/30"
                >
                  View All
                </button>
              )}

              {showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className="flex-shrink-0 w-20 h-20 rounded-full bg-white/30"
                >
                  Show Less
                </button>
              )}
            </div>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black/80 to-transparent" />

            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black/80 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
