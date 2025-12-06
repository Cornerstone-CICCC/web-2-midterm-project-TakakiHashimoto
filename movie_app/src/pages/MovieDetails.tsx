import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getActors, searchMovie } from "../../api";

function MovieDetails() {
  const { id } = useParams();
  const movieId = Number(id);

  const { data, isLoading } = useQuery({
    queryKey: ["searchMovie", movieId],
    queryFn: () => searchMovie(movieId),
  });

  const { data: actors } = useQuery({
    queryKey: ["actors", movieId],
    queryFn: () => getActors(movieId),
  });
  if (isLoading) return <p></p>;

  const bgUrl = `https://image.tmdb.org/t/p/w500${data.backdrop_path}`;
  return (
    <div className="ml-[12%]">
      <div
        className={`flex w-full h-screen bg-cover bg-center w-<4/5> relative`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="flex flex-col gap-5 z-10 text-white">
          <h1 className="text-7xl">{data.title}</h1>
          <div className="flex gap-5">
            <p>⭐ {data.vote_average}</p>
            <p>
              {Math.floor(data.runtime / 60)} h {data.runtime % 60}m
            </p>
            {data.genres.map((genre: { id: number; name: string }) => (
              <p>{genre.name},</p>
            ))}
            <p>{data.release_date.split("-")[0]}</p>
          </div>
          <p>{data.overview}</p>
        </div>
        <div className="relative z-10 mt-10 ">
          <h2 className="text-3xl mb-4">Actors</h2>
          <div className="flex gap-2 text-center overflow-x-scroll">
            {actors?.cast.map((actor) => (
              <div key={actor.id}>
                {actor.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    className="w-30 h-30 rounded-full"
                  />
                )}

                {actor.profile_path && <p>{actor.name}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
