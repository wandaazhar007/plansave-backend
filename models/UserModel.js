import { connectDB } from "../config/dbConfig.js";

const db = await connectDB();

export const createUser = async (email, passwordHash, name) => {
  const query = `
    INSERT INTO users (email, password_hash, name, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `;
  const [result] = await db.execute(query, [email, passwordHash, name]);
  return result;
};

export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await db.execute(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};