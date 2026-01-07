type Movie = {
  tmdb_id: number;
  title: string;
  poster: string;
  watched: boolean;
  favorite: boolean;
  watchlist: boolean;
};

function PosterCard({ movie }: { movie: Movie }) {
  return (
    <div className="min-w-[150px]">
      <img
        src={movie.poster}
        className="w-full h-[220px] object-cover rounded-lg"
      />
      <p className="mt-2 text-sm truncate">{movie.title}</p>
    </div>
  );
}

export { PosterCard };
