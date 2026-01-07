import { Link } from "react-router-dom";
// import { string } from "zod";

type Props = {
  imageSrc: string;
  title: string;
  year: string;
  vote: number;
  id: number;
  category: string;
};

function Card({ imageSrc, title, year, vote, id, category }: Props) {
  // if category === movie
  {
    category === "movie" ? "" : "";
  }
  return (
    <div className="flex flex-col gap-1 w-[220px]  bg-blue-950/10 rounded-2xl shadow-2xl shrink-0 pb-3">
      <Link to={`/movie/${category}/${id}`}>
        <img
          src={imageSrc}
          alt="image of the movie"
          className="w-70 h-90 rounded-t-2xl"
        />
      </Link>
      <p className="line-clamp-2">{title}</p>

      <p>Release Year: {year}</p>
      <p>⭐ {vote.toFixed(1)}</p>
    </div>
  );
}

export default Card;
