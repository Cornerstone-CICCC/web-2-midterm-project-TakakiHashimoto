import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../../api";
import Section from "../components/Section";
import LightRays from "../components/LightRays";
import Searchbar from "../components/Searchbar";
// import { BrowserRouter } from "react-router-dom";

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["trendingMovie"],
    queryFn: () => getTrendingMovies(),
  });

  //   function switchToHome() {
  //     setIsHome(true);
  //     setIsAbout(false);
  //   }

  //   function switchToAbout() {
  //     setIsHome(false);
  //     setIsAbout(true);
  //   }

  const [category, setCategory] = useState("movie");

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={0.1}
          lightSpread={0.8}
          rayLength={9}
          followMouse={true}
          mouseInfluence={1.1}
          noiseAmount={0.1}
          distortion={0.01}
          className="custom-rays "
        />
      </div>
      <div className="flex flex-col gap-3 ">
        <div className="mx-auto mt-16 flex w-full max-w-screen-2xl flex-col gap-8 px-4 sm:px-6 md:px-10">
          <Searchbar
            className="border border-white/20 rounded-3xl px-4 py-2 text-white bg-black/30 backdrop-blur-sm placeholder-white/40focus:outline-none focus:border-cyan-400 w-full md:max-w-md"
            category={category}
          />

          <Section category={category} setCategory={setCategory} />
        </div>
      </div>
    </div>
  );
}

export default Home;
