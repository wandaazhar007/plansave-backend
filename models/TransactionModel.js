import { connectDB } from "../config/DbConfig.js

const db = await connectDB();

export const getTransactionsByUserId = async (userId) => {
  const query = `SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC`;
  const [rows] = await db.execute(query, [userId]);
  return rows;
};

export const createTransaction = async (userId, budgetId, amount, description, date) => {
  const query = `
    INSERT INTO transactions (user_id, budget_id, amount, description, date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const [result] = await db.execute(query, [userId, budgetId, amount, description, date]);
  return result;
};