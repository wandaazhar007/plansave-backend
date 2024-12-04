import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/DbConfig.js";
import authRoutes from "./routes/AuthRoutes.js";
import budgetRoutes from "./routes/BudgetRoutes.js";
import transactionRoutes from "./routes/TransactionRoutes.js";

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
})();

// Routes
app.use("/auth", authRoutes); // Authentication routes
app.use("/budgets", budgetRoutes); // Budget management routes
app.use("/transactions", transactionRoutes); // Transaction management routes

// Root endpoint
app.get("/", (req, res) => {
  res.send("Plansave backend is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!", error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});