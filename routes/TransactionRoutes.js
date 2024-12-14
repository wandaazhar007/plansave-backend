import express from "express";
import { getTransactions, addTransaction, deleteTransaction, editTransaction, searchTransaction } from "../controllers/TransactionController.js";
import { authenticateToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Get all transactions for the user
router.get("/api/transactions", authenticateToken, getTransactions);

// Add a new transaction
router.post("/api/transactions", authenticateToken, addTransaction);

//Delete a transaction
router.delete("/api/transactions/:id", authenticateToken, deleteTransaction);

//Update a transaction
router.put("/api/transactions/:id", authenticateToken, editTransaction);

//Search a transaction
router.get("/api/transactions/search", authenticateToken, searchTransaction);


export default router;