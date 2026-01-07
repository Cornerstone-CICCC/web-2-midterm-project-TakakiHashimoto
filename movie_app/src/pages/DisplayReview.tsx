import { useQuery } from "@tanstack/react-query";
import { getReview } from "../../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DisplayReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: reviews,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["review", user?.id],
    queryFn: getReview,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20 text-gray-400">
        Loading reviews...
      </div>
    );
  }

  if (isError || !reviews?.length) {
    return (
      <div className="flex justify-center mt-20 text-gray-400">
        No reviews yet.
      </div>
    );
  }
  type Review = {
    tmdb_id: number;
    title: string;
    poster: string;
    rating: number;
    thoughts: string;
    notes: string;
    release_year: string;
  };
  return (
    <div
      className="mt-20 px-6 max-w-6xl mx-auto bg-gradient-to-br 
  from-[#0f0f12] 
  via-[#14141a] 
  to-[#09090b]
  text-white"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Your Reviews</h2>

      <div className="flex flex-col gap-6">
        {reviews.map((review: Review, idx: number) => (
          <div
            key={idx}
            className="flex gap-6 bg-zinc-900/80 rounded-xl p-5 shadow-lg hover:bg-zinc-900 transition"
            onClick={() => navigate(`/movie/movie/${review.tmdb_id}`)}
          >
            {/* Poster */}
            <img
              src={review.poster}
              alt={review.title}
              className="w-[120px] h-[180px] object-cover rounded-lg"
            />

            {/* Content */}
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {review.title}
                  </h3>
                  <p className="text-sm text-gray-400">{review.release_year}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ {review.rating}/10
                </div>
              </div>

              {/* Thoughts */}
              <p className="text-gray-200 mt-4 leading-relaxed">
                {review.thoughts}
              </p>

              {/* Notes */}
              {review.notes && (
                <p className="text-gray-400 text-sm mt-2 italic">
                  “{review.notes}”
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DisplayReview };
