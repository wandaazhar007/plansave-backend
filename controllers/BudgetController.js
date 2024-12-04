import { connectDB } from "../config/DbConfig.js";

const db = await connectDB();

export const getBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute("SELECT * FROM budgets WHERE user_id = ?", [userId]);

    res.status(200).send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error retrieving budgets", error: err.message });
  }
};

export const addBudget = async (req, res) => {
  const { category, subcategory, amount, timeframe } = req.body;
  const userId = req.user.id;

  try {
    await db.execute(
      "INSERT INTO budgets (user_id, category, subcategory, amount, timeframe, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [userId, category, subcategory, amount, timeframe]
    );

    res.status(201).send({ message: "Budget added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding budget", error: err.message });
  }
};