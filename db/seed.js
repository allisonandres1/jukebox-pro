import db from "#db/client.js";

import { createUser } from "#db/queries/users.js";
import { createPlaylist } from "#db/queries/playlists.js";
import { createPlaylistTrack } from "#db/queries/playlists_tracks.js";
import { createTrack } from "#db/queries/tracks.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user1", "password123");
  const user2 = await createUser("user2", "password456");

  const trackIds = [];
  for (let i = 1; i <= 10; i++) {
    const track = await createTrack("Track " + i, i * 50000);
    trackIds.push(track.id);
  }

  const user1Playlist = await createPlaylist(
    "user1’s Favorites",
    "Chill and mellow tunes",
    user1.id
  );
  const user2Playlist = await createPlaylist(
    "user2’s Rock Mix",
    "Energetic and bold",
    user2.id
  );

  for (let i = 0; i < 5; i++) {
    await createPlaylistTrack(user1Playlist.id, trackIds[i]);
  }
  for (let i = 5; i < 10; i++) {
    await createPlaylistTrack(user2Playlist.id, trackIds[i]);
  }

  console.log("✅ Seeded users, playlists, and tracks!");
}
