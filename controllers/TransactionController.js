import { connectDB } from "../config/DbConfig.js";

const db = await connectDB();

export const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
      [userId]
    );

    res.status(200).send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error retrieving transactions", error: err.message });
  }
};

export const addTransaction = async (req, res) => {
  const { budgetId, amount, description, date } = req.body;
  const userId = req.user.id;

  try {
    await db.execute(
      "INSERT INTO transactions (user_id, budget_id, amount, description, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [userId, budgetId, amount, description, date]
    );

    res.status(201).send({ message: "Transaction added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding transaction", error: err.message });
  }
};