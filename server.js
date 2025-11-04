import app from "#app";
import db from "#db/client.js";

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(3000, () => {
  console.log(`Listening on port ${3000}...`);
});
