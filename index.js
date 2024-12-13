import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import fileUpload from "express-fileupload";
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
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ credentials: true, origin: ['http://localhost:2002', 'http://localhost:3000', 'https://plansave.com'] }));
// app.use(cors({ credentials: true, origin: "*" }));
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON
app.use(fileUpload()); // Enable file uploads
app.use(cors({ credentials: true, origin: '*' }));
app.use(helmet()); // Security headers


// Database connection with retry mechanism
(async function connectWithRetry() {
  try {
    await connectDB();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Failed to connect to the database, retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
})();

// Routes (prefixes are handled inside the routes themselves)
app.use(authRoutes);
app.use(budgetRoutes);
app.use(transactionRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Plansave backend is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Handle specific error types (e.g., validation errors)
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message });
  }

  // General error response
  res.status(err.status || 500).send({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});