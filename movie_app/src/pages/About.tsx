function About() {
  return (
    <div className="bg-gradient-to-br from from-cyan-900/50 via-black h-screen">
      <section className="max-w-3xl mx-auto text-white px-6 py-20 flex flex-col gap-5 items-center">
        <h1 className="text-4xl font-bold mb-6">About</h1>

        <div className="text-lg">
          <p className="text-white/80 leading-relaxed mb-6">
            MovieTracker is a personal movie and TV discovery app built for
            people who care about both quality and experience.
          </p>

          <p className="text-white/60 leading-relaxed mb-6">
            Inspired by the depth of IMDb a nd the cinematic feel of Netflix,
            MovieTracker combines trustworthy data with an immersive browsing
            experience. Features include favorites, watch list and memo taking
            features!
          </p>

          <p className="text-white/60 leading-relaxed">
            Data and images are provided by The Movie Database (TMDB).
          </p>

          <div className="flex gap-4 justify-start mt-5">
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none hover:bg-white/50">
              Login In
            </button>
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none hover:bg-white/50">
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
