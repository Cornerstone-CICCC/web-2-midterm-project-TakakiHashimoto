// import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  className?: string;
};

function Navbar({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className={`${className} flex items-center justify-between px-10
                  bg-black/30 backdrop-blur-md
                  border-b border-white/10`}
      >
        <Link to="/" className="text-white font-bold text-xl tracking-wide">
          MovieTrack
        </Link>

        <div className="hidden md:flex gap-8 text-white/80">
          <a href="/" className="hover:text-white transition">
            Home
          </a>
          <a href="/about" className="hover:text-white transition">
            About
          </a>

          <a href="/top100tvs" className="hover:text-white transition">
            Top 100 TV Shows
          </a>

          <a href="/top100movies" className="hover:text-white transition">
            Top 100 Movies
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5 z-50"
        >
          <span
            className={`w-6 h-0.5 bg-white transition
              ${isOpen && "rotate-45 translate-y-2"}`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition
              ${isOpen && "opacity-0"}`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition
              ${isOpen && "-rotate-45 -translate-y-2"}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 transition
        ${isOpen ? "visible bg-black/70" : "invisible"}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-72
          bg-black/90 backdrop-blur-xl
          p-8
          transition-transform
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <nav className="flex flex-col gap-6 text-white text-lg mt-16">
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link to="/top100movies" onClick={() => setIsOpen(false)}>
              Top 100 Movies
            </Link>

            <Link to="/top100tvs" onClick={() => setIsOpen(false)}>
              Top 100 TV Shows
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
