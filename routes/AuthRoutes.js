import express from "express";
import { register, login } from "../controllers/AuthController.js";

const router = express.Router();

// User registration route
router.post("/api/register", register);

// User login route
router.post("/api/login", login);

export default router;