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
import SearchResults from "./pages/SearchResults";
import Top100TvShows from "./pages/Top100TvShows";
import Top100Movies from "./pages/Top100Movies";
import { ThemeProvider } from "./context/ThemContext";
import { Login } from "./pages/Login";
import { Signin } from "./pages/Signin";
import { DashBoard } from "./pages/DashBoard";
import { RequireAuth } from "./components/RequireAuth";
import { AuthContextProvider } from "./context/AuthContext";
import { ReviewPage } from "./pages/Review";
import { Watched } from "./pages/Watched";
import { Watchlist } from "./pages/Watchlist";
import { Favorites } from "./pages/Favorites";
import { DisplayReview } from "./pages/DisplayReview";

function App() {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Navbar className="fixed top-0 left-0 w-full h-16 z-50" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:category/:id" element={<MovieDetails />} />
            <Route path="about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/top100tvs" element={<Top100TvShows />} />
            <Route path="/top100movies" element={<Top100Movies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<Signin />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/dashboard/watched" element={<Watched />} />
              <Route path="/dashboard/watchlist" element={<Watchlist />} />
              <Route path="/dashboard/favorites" element={<Favorites />} />
              <Route path="/dashboard/review" element={<DisplayReview />} />
            </Route>
            <Route path="/review/:id" element={<ReviewPage />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
