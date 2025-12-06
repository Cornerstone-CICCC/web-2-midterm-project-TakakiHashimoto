import React from "react";
import { Link } from "react-router-dom";
import { string } from "zod";

type Props = {
  imageSrc: string;
  title: string;
  year: string;
  vote: number;
  id: number;
};

function Card({ imageSrc, title, year, vote, id }: Props) {
  return (
    <div className="flex flex-col gap-1 w-[220px]  bg-blue-950/10 rounded-2xl shadow-2xl shrink-0">
      <Link to={`movie/${id}`}>
        <img
          src={imageSrc}
          alt="image of the movie"
          className="w-70 h-90 rounded-t-2xl"
        />
      </Link>
      <p>{title}</p>
      <p>Release Year: {year}</p>
      <p>Rating: {vote}</p>
    </div>
  );
}

export default Card;
