import express from "express";
import { getTransactions, addTransaction, deleteTransaction } from "../controllers/TransactionController.js";
import { authenticateToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Get all transactions for the user
router.get("/api/transactions", authenticateToken, getTransactions);

// Add a new transaction
router.post("/api/transactions", authenticateToken, addTransaction);

//Delete a transaction
router.delete("/api/transactions/:id", authenticateToken, deleteTransaction);
export default router;