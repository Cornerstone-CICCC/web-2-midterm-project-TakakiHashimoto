import React from "react";
import { string } from "zod";

type Props = {
  imageSrc: string;
  title: string;
  year: string;
  vote: number;
};

function Card({ imageSrc, title, year, vote }: Props) {
  return (
    <div className="flex flex-col gap-3 w-[280px] bg-blue-950/10 rounded-2xl shadow-2xl shrink-0">
      <img
        src={imageSrc}
        alt="image of the movie"
        className="w-70 h-90 rounded-t-2xl"
      />
      <p>{title}</p>
      <p>{year}</p>
      <p>{vote}</p>
    </div>
  );
}

export default Card;
