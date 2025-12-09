// import React, { useState } from "react";
import Card from "./cards/Card";
// import { useQuery } from "@tanstack/react-query";
// import { getTrendingMovies } from "../../api";
import { type Movie, type TvShow } from "../schemas/trendingMovie";
// import Select from "./Select";

type Props = {
  genreTitle: string;
  movieList: Movie[] | TvShow[];
  category: string;
};

type dataSetProps = {
  title: string;
  imageSrc: string;
  year: string;
  vote: number;
  id: number;
};

function Genre({ genreTitle, movieList, category }: Props) {
  const dataSet: dataSetProps[] = [];
  movieList.map((movie) => {
    if (category === "movie") {
      dataSet.push({
        title: movie.title,
        imageSrc: movie.poster_path,
        year: movie.release_date,
        vote: movie.vote_average,
        id: movie.id,
      });
    } else {
      dataSet.push({
        title: movie.name,
        imageSrc: movie.poster_path,
        year: movie.first_air_date,
        vote: movie.vote_average,
        id: movie.id,
      });
    }
  });

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <h2 className="font-extrabold text-2xl mb-5">{genreTitle}</h2>
      <div className="flex gap-3 overflow-x-scroll whitespace-nowrap">
        {dataSet.map((data) => {
          return (
            <Card
              key={data.id}
              imageSrc={`https://image.tmdb.org/t/p/w500${data.imageSrc}}`}
              title={data.title}
              year={data.year}
              vote={data.vote}
              id={data.id}
              category={category}
            ></Card>
          );
        })}
      </div>
    </div>
  );
}

export default Genre;
