// import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemContext";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../api";
import { useAuth } from "../context/AuthContext";

type Props = {
  className?: string;
};

function Navbar({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const navigation = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigation("/");
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
    setUser(null);
  }

  return (
    <>
      <div
        className={`${className} flex items-center justify-between px-10
                  bg-black/30 backdrop-blur-md
                  border-b border-white/10`}
      >
        <div className="flex gap-2">
          <Link to="/" className="text-white font-bold text-xl tracking-wide">
            MovieTrack
          </Link>
          <p>{user?.email}</p>
        </div>

        <div className="hidden md:flex gap-8 text-white/80">
          {!user && (
            <a href="/login" className="hover:text-white transition">
              log in
            </a>
          )}
          {!user && (
            <a href="/signin" className="hover:text-white transition">
              Sign Up
            </a>
          )}

          {user && (
            <a href="/dashboard" className="hover:text-white transition">
              Dash Board
            </a>
          )}
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

          {user && <button onClick={handleLogout}>Log Out</button>}

          <button
            onClick={() => toggleTheme()}
            className="hover:text-white transition"
          >
            {isDark ? <p>🔆</p> : <p>🌙</p>}
          </button>
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
