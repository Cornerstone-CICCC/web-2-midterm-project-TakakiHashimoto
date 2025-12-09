import { useQuery } from "@tanstack/react-query";
import { searchMoviesByName } from "../../api";
import { Link, useSearchParams } from "react-router-dom";

type Props = {};

function SearchResults({}: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  const { data, isLoading } = useQuery({
    queryKey: ["searchMovieByName", query],
    queryFn: () => searchMoviesByName(query!, category!),
  });

  if (isLoading) return <p>Loading</p>;
  return (
    <div className="mt-17 flex flex-col gap-5 bg-gradient-to-br from from-cyan-900/50 via-black ">
      <h1 className="text-5xl">
        <span className="font-bold">{data.results.length}</span> results found
      </h1>
      {data?.results.map((result) => {
        return (
          <div key={result.id} className="flex gap-5">
            <img
              src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
              className="w-40 h-40 rounded-md"
            />
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold">{result.title}</p>
              <p>{result.release_date}</p>
            </div>
            <Link to={`/movie/${category}/${result.id}`} className="underline">
              See Details →
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResults;
