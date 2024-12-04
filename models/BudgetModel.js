import { connectDB } from "../config/DbConfig.js"

const db = await connectDB();

export const getBudgetsByUserId = async (userId) => {
  const query = `SELECT * FROM budgets WHERE user_id = ?`;
  const [rows] = await db.execute(query, [userId]);
  return rows;
};

export const createBudget = async (userId, category, subcategory, amount, timeframe) => {
  const query = `
    INSERT INTO budgets (user_id, category, subcategory, amount, timeframe, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const [result] = await db.execute(query, [userId, category, subcategory, amount, timeframe]);
  return result;
};