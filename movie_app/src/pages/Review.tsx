// get review inputs
// send them to the backend
// Dash board page should get it with the matching tmdb_id

import { useMutation } from "@tanstack/react-query";
import { addReview } from "../../api";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Rating } from "../components/Rating";

function ReviewPage() {
  const { id } = useParams();
  const tmdbId = Number(id);
  const location = useLocation();
  const state = location.state as
    | { poster: string; title: string; release_year: string }
    | undefined;
  if (!state) {
    return (
      <div className="mt-17">
        <p>Invalid naviagetion. Go back.</p>
      </div>
    );
  }
  const poster = state?.poster;
  const title = state?.title;
  const release_year = state?.release_year;
  const navigate = useNavigate();

  const [thoughts, setThoughts] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRate] = useState(0);

  const reviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      console.log("success");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log(error);
      navigate("/");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(e.target);
    reviewMutation.mutate({
      movieId: tmdbId,
      thoughts: thoughts,
      notes: notes,
      rating: rating,
      title: title!,
      release_year: release_year,
      poster: poster,
    });
  }

  if (!poster || !title) {
    return (
      <div className="p-6 text-white">
        <p>Loading movie info...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-16 bg-gradient-to-br from-cyan-600/50 via-black h-screen">
      <div className="flex ">
        <img src={poster} className="w-[50%] h-screen" />
        <div className="flex justify-center items-center w-full">
          <form
            onSubmit={handleSubmit}
            className=" flex flex-col gap-5 w-max-[70%] justify-center items-center"
          >
            <textarea
              onChange={(e) => {
                setThoughts(e.target.value);
              }}
              value={thoughts}
              placeholder="Enter your thoughts here..."
              rows={5}
              cols={50}
              className="bg-white/20 rounded-lg py-2 px-2 caret-white outline-none focus:ring-2 focus:ring-cyan-400 cursor-auto"
            ></textarea>
            <textarea
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              value={notes}
              placeholder="Enter your notes about this movie here..."
              rows={5}
              cols={50}
              className="bg-white/20 rounded-lg py-2 px-2 caret-white outline-none focus:ring-2 focus:ring-cyan-400"
            ></textarea>

            <Rating onChange={setRate} rating={rating} />
            <button
              type="submit"
              className="cursor-pointer hover:bg-lime-500 hover:text-black max-w-[30%] rounded-sm self-center px-5 py-1 text-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { ReviewPage };
