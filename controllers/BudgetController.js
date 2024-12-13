import { connectDB } from "../config/DbConfig.js";

const db = await connectDB();

// export const getBudgets = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const [rows] = await db.execute("SELECT * FROM budgets WHERE user_id = ?", [userId]);

//     res.status(200).send(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Error retrieving budgets", error: err.message });
//   }
// };

export const getBudgets = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    // Parse limit and offset
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt((page - 1) * parsedLimit, 10);

    // Debugging logs
    // console.log("Query: SELECT * FROM budgets WHERE user_id = ? LIMIT ? OFFSET ?");
    // console.log("Parameters: ", [userId, parsedLimit, parsedOffset]);

    // Ensure valid parameters
    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).send({ message: "Invalid pagination parameters" });
    }

    // Execute query
    // const [rows] = await db.execute(
    //   "SELECT * FROM budgets WHERE user_id = ? LIMIT ? OFFSET ?",
    //   [userId, parsedLimit, parsedOffset]
    // );

    const query = `SELECT * FROM budgets WHERE user_id = ${userId} LIMIT ${parsedLimit} OFFSET ${parsedOffset}`;
    const [rows] = await db.execute(query);

    // console.log("Query Result: ", rows);

    // Send response
    res.status(200).send({ budgets: rows });
  } catch (err) {
    console.error("Error executing query: ", err.message);
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

export const searchBudget = async (req, res) => {
  const { keyword, page = 1, limit = 10 } = req.query; // Get the keyword, page, and limit from the query parameters
  const userId = req.user.id; // Get the user ID from the authenticated request

  try {
    // Parse pagination parameters
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt((page - 1) * parsedLimit, 10);

    // Validate pagination parameters
    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      return res.status(400).send({ message: "Invalid pagination parameters" });
    }

    // Search for budgets where the category or subcategory matches the keyword
    const [rows] = await db.execute(
      `SELECT * FROM budgets 
             WHERE user_id = ? 
             AND (category LIKE ? OR subcategory LIKE ?)`,
      [userId, `%${keyword}%`, `%${keyword}%`]
    );

    // Get total count for pagination
    const [totalCountResult] = await db.execute(
      `SELECT COUNT(*) as total FROM budgets 
       WHERE user_id = ? 
       AND (category LIKE ? OR subcategory LIKE ?)`,
      [userId, `%${keyword}%`, `%${keyword}%`]
    );

    const totalCount = totalCountResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / parsedLimit);
    const hasMore = page < totalPages;

    // If no results, return a 404 response
    if (rows.length === 0) {
      return res.status(404).send({ message: "No budgets found matching your search." });
    }

    // Send response with pagination details
    res.status(200).send({
      budgets: rows,
      currentPage: parseInt(page, 10),
      totalPages,
      totalResults: totalCount,
      hasMore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error searching budgets", error: err.message });
  }
};