import db from "#db/client.js";

export async function createUser(username, password) {
  const sql = `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING *
    `;

  const {
    rows: [user],
  } = await db.query(sql, [username, password]);
  return user;
}

export async function getUsers() {
  const { rows } = await db.query("SELECT * FROM users");
  return rows;
}

export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return user;
}

export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return user;
}
