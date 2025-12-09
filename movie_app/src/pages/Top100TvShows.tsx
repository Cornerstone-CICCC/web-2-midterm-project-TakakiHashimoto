import { useQuery } from "@tanstack/react-query";
import { getTopShows } from "../../api";
import { Link } from "react-router-dom";

type Props = {};

function Top100Moives() {
  const { data } = useQuery({
    queryKey: ["topShows"],
    queryFn: () => getTopShows(),
  });
  return (
    <div className="flex flex-col gap-3 mt-17 bg-indigo-900/20">
      <section className="bg-gradient-to-r from-cyan-900/50 via-red-950/30 to-blue-900/50 w-full text-center">
        <h1 className="text-6xl font-extrabold tracking-wide">
          <span className="text-red-600">TOP</span>
          <span className="text-white">10</span>
        </h1>
        <p className="mt-2 text-lg text-white/70">Shows (English)</p>
        <p className="text-sm text-white/40">
          {new Date().getFullYear()}-{new Date().getMonth() + 1}-{" "}
          {new Date().getDate()}
        </p>
        <div className="grid grid-cols-5 gap-4 py-8">
          {data?.slice(0, 10).map((movie, index) => (
            <div className="flex relative justify-center ml-10">
              <span className="absolute -left-9 text-[140px] font-extrabold text-white/10 select-none">
                {index + 1}
              </span>
              <Link to={`/movie/tv/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="relative z-10 w-35 rounded-xl shadow-2xl"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3 text-center mt-10">
        <div>
          <h1 className="text-7xl font-bold mb-5">Top 100</h1>
        </div>
        {data?.map((movie, index) => {
          return (
            <Link to={`/movie/tv/${movie.id}`}>
              <div className="flex gap-4 bg-black/20 ">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="w-30 h-30 rounded-xl"
                />

                <div className="flex flex-col gap-2 items-start">
                  <p className="">#{index + 1}</p>
                  <p>{movie.name}</p>
                  <div className="flex gap-2">
                    <p>{movie.first_air_date.split("-")[0]}</p>
                    <p>
                      <p>
                        ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count})
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

export default Top100Moives;
