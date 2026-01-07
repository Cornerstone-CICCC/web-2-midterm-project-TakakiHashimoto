import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRating, getfav } from "../../api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Rating } from "../components/Rating";

type Movie = {
  tmdb_id: number;
  title: string;
  poster: string;
  watched: boolean;
  favorite: boolean;
  watchlist: boolean;
  release_year: string;
  movie_id: number;
};

function Favorites() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRate] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const queryClient = useQueryClient();

  const rateMutateion = useMutation({
    mutationFn: addRating,
    onSuccess: () => {
      setShowModal(false);
      setSelectedMovie(null);
      setRate(0);

      queryClient.invalidateQueries({ queryKey: ["watched"] }); // backend database updated == cached data is old, refetch
    },
    onError: () => {
      console.log("");
    },
  });

  // movies.tmdb_id, movies.poster, movies.title, watchlists.watched, watchlists.favorite,watchlists.watchlist
  const { data: watchlist } = useQuery<Movie[]>({
    queryKey: ["fav", user?.id],
    queryFn: () => {
      return getfav();
    },
    enabled: !!user,
  });

  function openModal(movie: Movie) {
    setSelectedMovie(movie);
    setShowModal(true);
    setRate(0);
  }

  function closeModal() {
    setSelectedMovie(null);
    setShowModal(false);
  }
  return (
    <div className="mt-18">
      <h1 className="text-5xl font-bold mb-4">Your Favorite</h1>
      {watchlist?.map((movie, index) => {
        return (
          <div className="flex gap-4 bg-black/20 mb-2 pb-2">
            <Link to={`/movie/movie/${movie.tmdb_id}`}>
              <img src={`${movie.poster}`} className="w-30 h-30 rounded-xl" />
            </Link>

            <div className="flex flex-col gap-2 items-start">
              <div className="bg-yellow-500/90 w-[60px] text-black font-bold rounded-br-lg">
                <p className="">{index + 1}</p>
              </div>
              <p className="font-bold">{movie.title}</p>
              <div className="flex gap-2 ">
                <p className="text-gray-400">
                  {movie.release_year.split("-")[0]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal(movie)}
                className="hover:text-blue-500 underline"
              >
                ☆ Rate
              </button>
            </div>
          </div>
        );
      })}

      {showModal && selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-xl w-[420px] p-6 relative">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white text-xl"
            >
              ✕
            </button>

            {/* Rating number */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold">
                {rating || "—"}
              </div>
            </div>

            <p className="text-center text-sm text-yellow-400 mb-1">
              RATE THIS
            </p>

            <h2 className="text-center text-lg font-bold mb-4">
              {selectedMovie.title}
            </h2>

            {/* Stars */}
            <div className="flex justify-center mb-6">
              <Rating rating={rating} onChange={setRate} />
            </div>

            {/* Actions */}
            <button
              className="w-full bg-yellow-400 text-black font-bold py-2 rounded-full mb-3"
              onClick={() =>
                rateMutateion.mutate({
                  movieId: selectedMovie.movie_id,
                  rating: rating,
                })
              }
            >
              Rate
            </button>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" />
              Remove from Watchlist
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export { Favorites };
