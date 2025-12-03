import React from "react";

type Props = {
  switchToHome: () => void;
  switchToAbout: () => void;
  className?: string;
};

function Navbar({ switchToHome, switchToAbout, className }: Props) {
  return (
    <div className={className}>
      <ul>
        <li>
          <button onClick={switchToHome}>Home</button>
        </li>
        <li>
          <button onClick={switchToAbout}>About</button>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
