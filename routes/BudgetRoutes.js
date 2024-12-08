import express from "express";
import { getBudgets, addBudget, editBudget, deleteBudget } from "../controllers/BudgetController.js";
import { authenticateToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Get all budgets for the user
router.get("/api/budgets", authenticateToken, getBudgets);

// Add a new budget
router.post("/api/budgets", authenticateToken, addBudget);

// Edit a budget
router.put("/api/budgets/:id", authenticateToken, editBudget);

// Delete a budget
router.delete("/api/budgets/:id", authenticateToken, deleteBudget);

export default router;