import { connectDB } from "../config/DbConfig.js";

const db = await connectDB();

export const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    // Parse limit and offset
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt((page - 1) * parsedLimit, 10);

    // Debugging
    // console.log("Parsed Limit:", parsedLimit, "Parsed Offset:", parsedOffset);

    // Validate parsed values
    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).send({ message: "Invalid pagination parameters" });
    }

    // Query to fetch transactions
    // const [transactions] = await db.execute(
    //   "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT ? OFFSET ?",
    //   [userId, parsedLimit, parsedOffset]
    // );

    const query = `SELECT * FROM transactions WHERE user_id = ${userId} LIMIT ${parsedLimit} OFFSET ${parsedOffset}`;
    const [transactions] = await db.execute(query);
    // Query to count total transactions
    const [totalResult] = await db.execute(
      "SELECT COUNT(*) AS total FROM transactions WHERE user_id = ?",
      [userId]
    );
    const totalTransactions = totalResult[0].total;

    // Calculate total pages
    const totalPages = Math.ceil(totalTransactions / parsedLimit);
    const hasMore = page < totalPages;

    // Send response
    res.status(200).send({
      transactions,
      currentPage: page,
      totalPages,
      hasMore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error retrieving transactions",
      error: err.message,
    });
  }
};


export const addTransaction = async (req, res) => {
  const { budget_id, amount, descriptions, date } = req.body; // Notice the key names matching your Postman request
  const userId = req.user.id;

  try {
    // Validate required fields
    if (!budget_id || !amount || !descriptions || !date) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Insert the transaction into the database
    await db.execute(
      "INSERT INTO transactions (user_id, budget_id, amount, description, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [userId, budget_id, amount, descriptions, date]
    );

    // Send success response
    res.status(201).send({ message: "Transaction added successfully" });
  } catch (err) {
    console.error("Error adding transaction:", err.message);
    res.status(500).send({ message: "Error adding transaction", error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params; // Get the transaction ID from the URL params
  const userId = req.user.id; // Ensure the user is deleting their own transaction

  try {
    // Validate that the `id` exists
    if (!id) {
      return res.status(400).send({ message: "Transaction ID is required" });
    }

    // Check if the transaction exists and belongs to the user
    const [transaction] = await db.execute(
      "SELECT * FROM transactions WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (transaction.length === 0) {
      return res.status(404).send({ message: "Transaction not found or not authorized" });
    }

    // Delete the transaction
    await db.execute("DELETE FROM transactions WHERE id = ? AND user_id = ?", [id, userId]);

    res.status(200).send({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err.message);
    res.status(500).send({ message: "Error deleting transaction", error: err.message });
  }
};