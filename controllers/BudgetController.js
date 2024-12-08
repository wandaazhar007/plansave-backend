import { connectDB } from "../config/DbConfig.js";

const db = await connectDB();

export const getBudgets = async (req, res) => {
  const userId = req.user.id;
  // console.log('user id: ', req.user.id);

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

export const editBudget = async (req, res) => {
  const { id } = req.params; // Budget ID from the URL
  const { category, subcategory, amount, timeframe } = req.body; // Updated fields from the request body
  const userId = req.user.id; // User ID from the authenticated request

  try {
    // Update the budget in the database
    const [result] = await db.execute(
      "UPDATE budgets SET category = ?, subcategory = ?, amount = ?, timeframe = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [category, subcategory, amount, timeframe, id, userId]
    );

    // Check if any rows were affected (i.e., the budget was updated)
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Budget not found or not authorized to edit." });
    }

    res.status(200).send({ message: "Budget updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error updating budget", error: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  const { id } = req.params; // Budget ID from the URL
  const userId = req.user.id; // User ID from the authenticated request

  try {
    // Delete the budget from the database
    const [result] = await db.execute(
      "DELETE FROM budgets WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    // Check if any rows were affected (i.e., the budget was deleted)
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Budget not found or not authorized to delete." });
    }

    res.status(200).send({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error deleting budget", error: err.message });
  }
};