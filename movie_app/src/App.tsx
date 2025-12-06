// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getTrendingMovies } from "../api";
// import Card from "./components/cards/Card";
// import Section from "./components/Section";
// import LightRays from "./components/LightRays";
import Navbar from "./components/Navbar";
// import Searchbar from "./components/Searchbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Navbar className="h-screen w-1/8 bg-black/20 backdrop-blur-md fixed" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
