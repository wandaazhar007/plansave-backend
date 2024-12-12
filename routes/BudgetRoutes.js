import express from "express";
import { getBudgets, addBudget, editBudget, deleteBudget, searchBudget } from "../controllers/BudgetController.js";
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

//Search budgets
router.get("/api/budgets/search", authenticateToken, searchBudget);

export default router;