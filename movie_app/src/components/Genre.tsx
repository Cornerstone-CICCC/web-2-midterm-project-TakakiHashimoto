import React, { useState } from "react";
import Card from "./cards/Card";
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../../api";
import { type Movie } from "../schemas/trendingMovie";
import Select from "./Select";

type Props = {
  genreTitle: string;
  movieList: Movie[];
};

function Genre({ genreTitle, movieList }: Props) {
  // get trending movie data
  // const [sort, setSort] = useState("genre");

  // const sortedByRating = [...movieList].sort(
  //   (a, b) => b.vote_average - a.vote_average
  // );
  // const passedData =
  //   sort === "genre"
  //     ? movieList
  //     : sort === "Ratings"
  //     ? sortedByRating
  //     : movieList;

  return (
    <div className="w-full">
      <h2 className="font-extrabold text-2xl">{genreTitle}</h2>
      <div className="flex gap-3 overflow-x-scroll whitespace-nowrap">
        {movieList?.map((movie) => {
          return (
            <Card
              key={movie.id}
              imageSrc={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              title={movie.title}
              year={movie.release_date}
              vote={movie.vote_average}
              id={movie.id}
            ></Card>
          );
        })}
      </div>
    </div>
  );
}

export default Genre;
