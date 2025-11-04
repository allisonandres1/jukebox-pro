import express from "express";
import db from "#db/client.js";
import requireUser from "#middleware/requireUser.js";
import { getTracks, getTrackById } from "#db/queries/tracks.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tracks = await getTracks();
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).json("Track not found.");
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }

    const {
      rows: [track],
    } = await db.query(
      "UPDATE tracks SET title=$1, artist=$2 WHERE id=$3 RETURNING *",
      [title, artist, id]
    );

    if (!track) return res.status(404).json({ error: "Track not found" });
    res.status(200).json(track);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query("DELETE FROM tracks WHERE id=$1", [id]);

    if (rowCount === 0)
      return res.status(404).json({ error: "Track not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
