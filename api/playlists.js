import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists.js";
import { createPlaylistTrack } from "#db/queries/playlists_tracks.js";
import { getTracksByPlaylistId } from "#db/queries/tracks.js";
import requireUser from "#middleware/requireUser.js";

router
  .route("/")
  .get(async (req, res) => {
    const playlists = await getPlaylists();
    res.json(playlists);
  })
  .post(requireUser, async (req, res) => {
    if (!req.body) return res.status(400).json("Request body is required.");

    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).json("Request body requires: name, description");

    const playlist = await createPlaylist(name, description);
    res.status(201).json(playlist);
  });

router.param("id", async (req, res, next, id) => {
  try {
    const playlist = await getPlaylistById(id);
    if (!playlist) return res.status(404).json("Playlist not found.");

    req.playlist = playlist;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.route("/:id").get((req, res) => {
  res.json(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.json(tracks);
  })
  .post(requireUser, async (req, res) => {
    if (!req.body) return res.status(400).json("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).json("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).json(playlistTrack);
  });
