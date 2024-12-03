import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConfig.js";

// Load environment variables
dotenv.config();

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
app.get("/", (req, res) => {
  res.send("plansave backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});