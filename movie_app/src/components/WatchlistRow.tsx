type Movie = {
  tmdb_id: number;
  title: string;
  poster: string;
  watched: boolean;
  favorite: boolean;
  watchlist: boolean;
};
function WatchlistRow({ movie }: { movie: Movie }) {
  return (
    <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-12 h-16 object-cover rounded"
      />
      <p className="flex-1 truncate">{movie.title}</p>
      <button className="text-sm text-red-400 hover:text-red-300">
        Remove
      </button>
    </div>
  );
}

export { WatchlistRow };
