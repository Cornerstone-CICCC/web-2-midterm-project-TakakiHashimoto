import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../api";
import Card from "./components/cards/Card";
import Section from "./components/Section";
import LightRays from "./components/LightRays";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";

function App() {
  const [isHome, setIsHome] = useState(true);
  const [isAbout, setIsAbout] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["trendingMovie"],
    queryFn: () => getTrendingMovies(),
  });

  function switchToHome() {
    setIsHome(true);
    setIsAbout(false);
  }

  function switchToAbout() {
    setIsHome(false);
    setIsAbout(true);
  }
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="overflow-x-hidden">
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 ">
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
      <div className="flex gap-3 ">
        <Navbar
          switchToHome={switchToHome}
          switchToAbout={switchToAbout}
          className="h-screen w-1/8 bg-black/20 backdrop-blur-md fixed"
        />
        <div className="ml-[15%] flex-1 flex flex-col gap-8 max-w-8/10 ">
          <Searchbar className="rounded-4xl border-solid border-white/10" />
          {isHome && (
            <div className="flex gap-4 justify-between">
              <Section />
            </div>
          )}
          {isAbout && <p>About page loaded</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
