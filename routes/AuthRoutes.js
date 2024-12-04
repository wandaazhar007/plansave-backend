import express from "express";
import { register, login } from "../controllers/AuthController.js";

const router = express.Router();

// User registration route
router.post("/register", register);

// User login route
router.post("/login", login);

export default router;