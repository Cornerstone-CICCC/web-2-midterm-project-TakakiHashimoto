// import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchMoviesByName } from "../../api";
import { useNavigate } from "react-router-dom";

type Props = { className: string; category: string };

function Searchbar({ className, category }: Props) {
  const navigate = useNavigate();

  function handleInput(event) {
    if (event.key === "Enter") {
      navigate(`/search?query=${event.target.value}&category=${category}`);
    }
  }

  return (
    <input
      type="search"
      className={className}
      placeholder="Search"
      onKeyDown={handleInput}
    />
  );
}

export default Searchbar;
