import React from "react";
import { Link } from "react-router-dom";

type Props = {
  className?: string;
};

function Navbar({ className }: Props) {
  return (
    <div className={className}>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"about"}>About</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
