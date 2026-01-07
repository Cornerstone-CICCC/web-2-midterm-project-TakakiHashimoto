import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import session from "express-session";
// import { Strategy as localStrategy } from "passport";
// import passport from "passport";
// import { success } from "zod";

dotenv.config();

const app = express();
const PORT = 5000;
const saltRound = 10;
const JWT_KEY = process.env.JWT_SECRET;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

// setting up database
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});
db.connect();

if (!JWT_KEY) {
  throw new Error("JWT Key is not defined");
}

interface AuthedRequest extends Request {
  userId?: number;
}

type JwtPayLoad = {
  userId: number;
};

// Hashing password
async function hashPw(password: string, saltround: number) {
  try {
    const hashedPw = await bcrypt.hash(password, saltround);
    return hashedPw;
  } catch (error) {
    console.log(error);
  }
}

// This function is like a bouncer:
// User wants to enter VIP room (/me)
//         ↓
// Bouncer checks ticket (JWT)
//         ↓
// Valid? → let in
// Invalid? → kick out

// ####################### Authentication middleware ########################
// How req, res, next will be passed?
// Later when you do app.get("/protectedRoute", authenticateJWT, (req, res) =>{})
// => By this line, express does authenticateJWT(req, res, next) => Same req and res
function authenticateJWT(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  console.log(req);

  const token = req.cookies.session; // Every time browser includes cookie in request

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    // If valid, it returns payload like, (userId:1, iat: "", exp: ""), If invalid, throws an error
    if (!JWT_KEY) {
      throw new Error("JWT Key is not defined");
    }
    const user = jwt.verify(token, JWT_KEY) as JwtPayLoad;
    req.userId = user.userId;
    console.log("AUTH userId:", req.userId);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "expired or invalid token",
    });
  }
}

// ############# Login ############
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  // Find user with this email form database
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "missing email or password",
    });
  }

  const user = await db.query("SELECT * FROM users WHERE email = ($1)", [
    email,
  ]);

  if (user.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email",
    });
  }

  const passedUser = user.rows[0];

  // compare the password with hashed password
  const isMatch = await bcrypt.compare(password, passedUser.password);
  if (!isMatch) {
    return res.status(404).json({
      success: false,
      message: "Password Not matched",
    });
  }

  // generate jwt for this user
  const token = jwt.sign({ userId: passedUser.id }, JWT_KEY, {
    expiresIn: "7d",
  });
  // respond with user data
  res.cookie("session", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.json({
    success: true,
    message: "Login Successful",
    user: { id: passedUser.id, email: passedUser.email },
  });
});

// ############ Sign in #################
app.post("/api/signin", async (req, res) => {
  // req = http requests: req.params = parameters like, id req.body = key:value paired data
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    console.log("One of the credentials missing");
    return res.status(400).json({
      success: false,
      message: "missing credentials",
    });
  }
  // Hashing the password
  const hashedPassword = await hashPw(password, saltRound);

  // adding user info into database
  try {
    const userData = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [username, email, hashedPassword]
    );
    console.log(userData);

    // generating a token
    // By this line, jwt does:
    // Convert header => base64
    // Convert payload => base64
    // genrerate signature using secret
    const token = jwt.sign({ userId: userData.rows[0].id }, JWT_KEY, {
      expiresIn: "7d",
    });
    // create token like {fjeiwfjwej.fjoiewjfiw.fiejfwoi} and get sent to front

    res.cookie("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({
      // res.json() converts object to json
      success: true,
      user: userData.rows[0],
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "23505") {
        return res.status(409).json({
          // The reason why res.status is because without it, it returns success and front won't know and will treat is as isSuccess == breaks frontend logic
          success: false,
          message: "Email already exists. Try logging in",
        });
      }
    }
  }
});

// ######### getting a user data after authenticating ###########
app.get("/api/me", authenticateJWT, async (req: AuthedRequest, res) => {
  const user = await db.query(
    "SELECT id, email, name FROM users WHERE id = $1",
    [req.userId]
  );
  return res.json(user.rows[0]);
});

// ######### getting a user's movie data  ###########
app.get("/api/movie", authenticateJWT, async (req: AuthedRequest, res) => {
  const movie = await db.query(
    "SELECT movies.tmdb_id, watchlists.watched, watchlists.favorite,watchlists.watchlist FROM watchlists JOIN movies ON watchlists.movie_id = movies.id WHERE watchlists.user_id = $1",
    [req.userId]
  );
  return res.json(movie.rows);
});

// #################### Adding watchlist ######################
app.post("/api/favorite", authenticateJWT, async (req: AuthedRequest, res) => {
  const { movieId, title, release_year, poster } = req.body;
  const userId = req.userId;

  if (!userId || !movieId) {
    return res
      .status(401)
      .json({ success: false, message: "missing userId or movieId" });
  }
  try {
    // adding to movies table and returning id of movies table
    const movie = await db.query(
      "INSERT INTO movies (tmdb_id, title, release_year, poster) VALUES ($1, $2, $3, $4) ON CONFLICT (tmdb_id) DO UPDATE SET title = EXCLUDED.title,release_year = COALESCE(movies.release_year, EXCLUDED.release_year), poster = COALESCE(movies.poster, EXCLUDED.poster) RETURNING id ",
      [movieId, title, release_year, poster]
    );

    // if the moive id is returned == if the movie row was first inserted.
    const internalMovieId = movie.rows[0]
      ? movie.rows[0].id
      : // else, if the movie that was tried being inserted was already existed, get that movie id
        (
          await db.query("SELECT id FROM movies WHERE tmdb_id = ($1)", [
            movieId,
          ])
        ).rows[0].id;

    // adding to the watch list with the movie id
    const favorite = await db.query(
      "INSERT INTO watchlists (user_id, movie_id, favorite) VALUES ($1, $2, true) ON CONFLICT (user_id, movie_id) DO UPDATE SET favorite = NOT COALESCE(watchlists.favorite, false) RETURNING favorite;",
      [userId, internalMovieId]
    );
    return res.json({
      success: true,
      message: "successfully added favorites",
      favorite: favorite.rows[0].favorite,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "something went wrong",
    });
  }
});

// #################### Adding watchlist ######################
app.post("/api/watchlist", authenticateJWT, async (req: AuthedRequest, res) => {
  // change the watchlist to true
  const { movieId, title, release_year, poster } = req.body; // This ==
  const userId = req.userId;

  if (!userId || !movieId) {
    return res.status(401).json({
      success: false,
      message: "missing one of the credentials",
    });
  }

  try {
    const movie = await db.query(
      "INSERT INTO movies (tmdb_id, title, release_year, poster) VALUES ($1, $2, $3, $4) ON CONFLICT (tmdb_id) DO UPDATE SET title = EXCLUDED.title,release_year = COALESCE(movies.release_year, EXCLUDED.release_year), poster = COALESCE(movies.poster, EXCLUDED.poster) RETURNING id ",
      [movieId, title, release_year, poster]
    );

    const internalMovieId = movie.rows[0]
      ? movie.rows[0].id
      : (
          await db.query("SELECT id FROM movies WHERE tmdb_id = ($1)", [
            movieId,
          ])
        ).rows[0].id;

    const watchlist = await db.query(
      "INSERT INTO watchlists (user_id, movie_id, watchlist) VALUES ($1, $2, true) ON CONFLICT (user_id, movie_id) DO UPDATE SET watchlist = NOT COALESCE(watchlists.watchlist, false) RETURNING watchlist;",
      [userId, internalMovieId]
    );
    return res.json({
      success: true,
      message: "Successfully added to watchlist",
      watchlist: watchlist.rows[0].watchlist,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      console.log(error);
      return res.status(409).json({
        success: false,
        message: "Already in Watchlist",
      });
    }
    console.log(error);
  }
});

// ###################
app.post("/api/watched", authenticateJWT, async (req: AuthedRequest, res) => {
  // change the watchlist to true
  const { movieId, title, release_year, poster } = req.body; // This ==
  const userId = req.userId;

  if (!userId || !movieId) {
    return res.status(401).json({
      success: false,
      message: "missing one of the credentials",
    });
  }

  try {
    const movie = await db.query(
      "INSERT INTO movies (tmdb_id, title, release_year, poster) VALUES ($1, $2, $3, $4) ON CONFLICT (tmdb_id) DO UPDATE SET title = EXCLUDED.title,release_year = COALESCE(movies.release_year, EXCLUDED.release_year), poster = COALESCE(movies.poster, EXCLUDED.poster) RETURNING id ",
      [movieId, title, release_year, poster]
    );

    const internalMovieId = movie.rows[0]
      ? movie.rows[0].id
      : (
          await db.query("SELECT id FROM movies WHERE tmdb_id = ($1)", [
            movieId,
          ])
        ).rows[0].id;

    const watched = await db.query(
      "INSERT INTO watchlists (user_id, movie_id, watched) VALUES ($1, $2, true) ON CONFLICT (user_id, movie_id) DO UPDATE SET watched = NOT COALESCE(watchlists.watched, false) RETURNING watched;",
      [userId, internalMovieId]
    );

    return res.json({
      success: true,
      message: "Successfully added to watchlist",
      watched: watched.rows[0].watched,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      console.log(error);
      return res.status(409).json({
        success: false,
        message: "Already in Watchlist",
      });
    }
    console.log(error);
  }
});

// ######################### adding review to database ##########################
app.post("/api/review", authenticateJWT, async (req: AuthedRequest, res) => {
  const userId = req.userId;
  const { movieId, thoughts, notes, rating, title, release_year, poster } =
    req.body;
  if (!movieId || !thoughts || !notes || !rating) {
    return res.status(400).json({
      message: "Missing one of the credentials",
    });
  }

  // First try inserting into movies table because there is an relationsihp between user_notes and movie
  const selectedMovieId = await db.query(
    "INSERT INTO movies (tmdb_id, title, release_year, poster) VALUES ($1, $2, $3, $4) ON CONFLICT (tmdb_id) DO NOTHING RETURNING id",
    [movieId, title, release_year, poster]
  );

  const id = selectedMovieId.rows[0]
    ? selectedMovieId.rows[0].id
    : (await db.query("SELECT id FROM movies WHERE tmdb_id = ($1)", [movieId]))
        .rows[0].id;

  // and then add the review
  await db.query(
    "INSERT INTO user_notes (user_id, movie_id, rating, thoughts, notes) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, movie_id) DO UPDATE SET rating = EXCLUDED.rating, thoughts = EXCLUDED.thoughts, notes = EXCLUDED.notes, updated_at = NOW()",
    [userId, id, rating, thoughts, notes]
  );

  return res.json({
    message: "successfully added your review",
  });
});

// ########## getting watchlist from watchlists #########################
app.get("/getWatchlist", authenticateJWT, async (req: AuthedRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "missing user id" });
  }

  const watchlist = await db.query(
    "SELECT movies.tmdb_id, movies.poster, movies.title, movies.release_year, watchlists.movie_id, watchlists.watched, watchlists.favorite,watchlists.watchlist FROM watchlists JOIN movies ON watchlists.movie_id = movies.id WHERE watchlists.user_id = $1 AND watchlists.watchlist IS TRUE",
    [userId]
  );
  return res.json(watchlist.rows);
});

// ########## getting favorite from favorites #########################
app.get("/getfav", authenticateJWT, async (req: AuthedRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "missing user id" });
  }

  const fav = await db.query(
    "SELECT movies.tmdb_id, movies.poster, movies.release_year, movies.title, watchlists.movie_id, watchlists.watched, watchlists.favorite,watchlists.watchlist FROM watchlists JOIN movies ON watchlists.movie_id = movies.id WHERE watchlists.user_id = $1 AND watchlists.favorite IS TRUE",
    [userId]
  );
  return res.json(fav.rows);
});

// ########## getting watched from watchlists #########################
app.get("/getWatched", authenticateJWT, async (req: AuthedRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "missing user id" });
  }

  const watched = await db.query(
    "SELECT movies.tmdb_id, movies.poster, movies.release_year, movies.title, watchlists.movie_id, watchlists.watched, watchlists.favorite,watchlists.watchlist FROM watchlists JOIN movies ON watchlists.movie_id = movies.id WHERE watchlists.user_id = $1 AND watchlists.watched IS TRUE",
    [userId]
  );
  return res.json(watched.rows);
});

// ############################## Getting user's review #########################
app.get("/getreview", authenticateJWT, async (req: AuthedRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "missing user id" });
  }

  const review = await db.query(
    "SELECT user_notes.thoughts, user_notes.notes, user_notes.rating, movies.title, movies.poster, movies.release_year, movies.tmdb_id FROM user_notes JOIN movies ON user_notes.movie_id = movies.id WHERE user_notes.user_id = $1 ",
    [userId]
  );
  return res.json(review.rows);
});

// #################### add rating ######################
app.post("/api/rating", authenticateJWT, async (req: AuthedRequest, res) => {
  const userId = req.userId;
  const { movieId, rating } = req.body;
  if (!movieId || !rating) {
    return res.status(400).json({
      message: "Missing one of the credentials",
    });
  }

  if (rating < 1 || rating > 10) {
    return res.status(400).json({
      message: "Rating must be between 1 and 10",
    });
  }

  const result = await db.query(
    "INSERT INTO user_notes (user_id, movie_id, rating) VALUES ($1, $2, $3) ON CONFLICT (user_id, movie_id) DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW() RETURNING *",
    [userId, movieId, rating]
  );

  return res.json({
    message: "successfully added your review",
    review: result.rows[0],
  });
});
// ######################### log out ######################

app.post("/logout", (req, res) => {
  // make the session no longer invalid == clear the session
  res.clearCookie("session", {
    // toke == name of the cookie needed to be deleted
    httpOnly: true,
    sameSite: "lax", // Cookies are only sent for same-site request and never for cross-site navigation
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "Successfully logged out!",
  });
});

// ################## app.listen() #######################
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
