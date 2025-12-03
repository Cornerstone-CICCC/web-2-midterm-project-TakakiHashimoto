import React from "react";
import Card from "./cards/Card";
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../../api";
import { type Movie } from "../schemas/trendingMovie";

type Props = {
  genreTitle: string;
  movieList: Movie[];
};

function Genre({ genreTitle, movieList }: Props) {
  // get trending movie data

  return (
    <div className="w-full">
      <h2 className="font-extrabold text-2xl">{genreTitle}</h2>
      <div className="flex gap-3 overflow-x-scroll whitespace-nowrap">
        {movieList?.map((movie) => {
          return (
            <Card
              imageSrc={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              title={movie.title}
              year={movie.release_date}
              vote={movie.vote_average}
            ></Card>
          );
        })}
      </div>
    </div>
  );
}

export default Genre;
