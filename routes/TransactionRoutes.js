import express from "express";
import { getTransactions, addTransaction } from "../controllers/TransactionController.js";

const router = express.Router();

// Get all transactions for the user
router.get("/api/transactions", getTransactions);

// Add a new transaction
router.post("/", addTransaction);

export default router;