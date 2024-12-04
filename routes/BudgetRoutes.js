import express from "express";
import { getBudgets, addBudget } from "../controllers/BudgetController.js";

const router = express.Router();

// Get all budgets for the user
router.get("/", getBudgets);

// Add a new budget
router.post("/", addBudget);

export default router;