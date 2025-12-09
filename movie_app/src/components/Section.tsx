import { useState } from "react";
import Title from "./Title";
import Genre from "./Genre";
import { useQuery } from "@tanstack/react-query";
import {
  getGenre,
  getTrendingMovies,
  getTrendingTvShows,
  getTvGenre,
} from "../../api";
import Select from "./Select";
// import type { Movie, TrendingMoviesResponse } from "../schemas/trendingMovie";

type Props = {
  id: number;
  name: string;
};

type sectionProps = {
  category: string;
  setCategory: (value: string) => void;
};

function Section({ category, setCategory }: sectionProps) {
  function updateCategory(value: string) {
    setCategory(value);
  }
  const { data, isLoading } = useQuery({
    queryKey: ["trendingMovie"],
    queryFn: () => getTrendingMovies(),
  });

  const { data: genreData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenre(),
  });

  const { data: tvShowsData } = useQuery({
    queryKey: ["tvshows"],
    queryFn: () => getTrendingTvShows(),
  });

  const { data: tvshowGenreData } = useQuery({
    queryKey: ["tvshowGenre"],
    queryFn: () => getTvGenre(),
  });
  // genreData.genre = [{id: 28, name: 'Action'}, {id: 28, name: 'Action'}, {id: 28, name: 'Action'}...]

  let passedData = category === "movie" ? data : tvShowsData;
  let passedGenre = category === "movie" ? genreData : tvshowGenreData;

  const [sort, setSort] = useState("genre");

  const sortedByRating = [...passedData?.results].sort(
    (a, b) => b.vote_average - a.vote_average
  );
  passedData = {
    ...passedData,
    results:
      sort === "genre"
        ? passedData.results
        : sort === "Ratings"
        ? sortedByRating
        : passedData.results,
  };

  if (isLoading) return <p>Loading</p>;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <Select
          change={updateCategory}
          value={category}
          options={["movie", "TV Shows"]}
          childrenClassName="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
        />
        <Select
          change={(value: string) => setSort(value)}
          value={sort}
          options={["Ratings", "genre"]}
          childrenClassName="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
        />
      </div>
      <Title category={category}></Title>
      {passedGenre?.genres.map((genre: Props) => {
        const selectedData = passedData?.results.filter((movie) => {
          return movie.genre_ids.includes(genre.id);
        });
        return (
          selectedData?.length !== 0 && (
            <Genre
              genreTitle={genre.name}
              movieList={selectedData ?? []}
              category={category}
            />
          )
        );
      })}
    </div>
  );
}

export default Section;
