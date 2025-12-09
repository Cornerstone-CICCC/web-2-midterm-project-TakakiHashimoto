import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getActors, searchMovie, searchShows } from "../../api";
import { useState } from "react";

function MovieDetails() {
  const { id, category } = useParams();
  const movieId = Number(id);

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

  const { data: actors } = useQuery({
    queryKey: ["actors", movieId],
    queryFn: () => getActors(movieId, category!),
  });

  const [showAll, setShowAll] = useState(false);
  const visibleActors = showAll ? actors?.cast : actors?.cast.slice(0, 4);

  if (isLoading) return <p></p>;

  const bgUrl = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
  return (
    <div className=" flex justify-center">
      <div
        className={`relative
    flex flex-col md:flex-row
    gap-8
    w-full
    min-h-[70vh] md:h-screen
    bg-cover bg-center
    px-5 md:px-8 pb-12
    items-start md:items-end
    mt-16 md:mt-0`}
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

          <button
            className="flex items-center justify-center gap-2
                       px-8 py-3
                       rounded-xl
                       bg-blue-900 hover:bg-blue-700
                       text-white text-sm font-semibold
                       shadow-lg shadow-blue-600/30
                       transition-all duration-200
                       active:scale-95 w-full sm:w-[30%]"
          >
            Watch List +
          </button>
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
