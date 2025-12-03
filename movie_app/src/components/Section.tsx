import React from "react";
import Title from "./Title";
import Genre from "./Genre";
import { useQuery } from "@tanstack/react-query";
import { getGenre, getTrendingMovies } from "../../api";

function Section() {
  const { data, isLoading } = useQuery({
    queryKey: ["trendingMovie"],
    queryFn: () => getTrendingMovies(),
  });

  const { data: genreData } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenre(),
  });

  // genreData.genre = [{id: 28, name: 'Action'}, {id: 28, name: 'Action'}, {id: 28, name: 'Action'}...]

  if (isLoading) return <p>Loading</p>;
  return (
    <div className="flex flex-col gap-5">
      <Title category="Movie"></Title>
      {genreData?.genres.map((genre) => {
        const selectedData = data?.results.filter((movie) => {
          return movie.genre_ids.includes(genre.id);
        });
        return <Genre genreTitle={genre.name} movieList={selectedData ?? []} />;
      })}
    </div>
  );
}

export default Section;
