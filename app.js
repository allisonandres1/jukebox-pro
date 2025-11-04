import express from "express";
import morgan from "morgan";

import getUserFromToken from "#middleware/getUserFromToken.js";
import tracksRouter from "#api/tracks.js";
import playlistsRouter from "#api/playlists.js";
import usersRouter from "#api/users.js";
import requireUser from "#middleware/requireUser.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(getUserFromToken);

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Jukebox API!");
});

app.get("/users/me", requireUser, (req, res) => {
  res.json(req.user);
});

export default app;
