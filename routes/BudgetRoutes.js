import express from "express";
import { getBudgets, addBudget } from "../controllers/BudgetController.js";

const router = express.Router();

// Get all budgets for the user
router.get("/api/budgets", getBudgets);

// Add a new budget
router.post("/api/budgets", addBudget);

export default router;