import React from "react";

type Props = { className: string };

function Searchbar({ className }: Props) {
  return <input type="search" className={className} placeholder="Search" />;
}

export default Searchbar;
