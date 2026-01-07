import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { sendLoginInfo } from "../../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: sendLoginInfo,
    onSuccess: (data) => {
      console.log(data);
      setUser(data.user);
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log(error);
      navigate("/login");
    },
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <div className="bg-gradient-to-br from from-cyan-900/50 via-black h-screen flex justify-center items-center">
      <div className="max-w-[50%] bg-blue-950/10 py-10 px-20 rounded-lg">
        <h2 className="text-white text-4xl">Log in to MovieTracker!</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-15">
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
              className="bg-white/20 rounded-lg py-2 px-2 caret-white outline-none focus:ring-2 focus:ring-cyan-400 cursor-auto"
            ></input>
          </div>
          <div className="flex flex-col gap-2 ">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              className="bg-white/20 rounded-lg py-2 px-2 caret-white outline-none focus:ring-2 focus:ring-cyan-400"
            ></input>
          </div>
          <button
            type="submit"
            className="cursor-pointer hover:bg-lime-500 hover:text-black max-w-[30%] rounded-sm self-center px-5 py-1 text-lg"
          >
            Submit
          </button>
        </form>
        {loginMutation.isPending && <p>Logging In</p>}
        {loginMutation.isError && (
          <p>Failed to log in {loginMutation.error.message}</p>
        )}
        {loginMutation.isSuccess && (
          <p>Welcome {loginMutation.data.user.name}</p>
        )}
      </div>
    </div>
  );
}

export { Login };
