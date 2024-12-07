import express from "express";
import { register, login, logout } from "../controllers/AuthController.js";

const router = express.Router();

// User registration route
router.post("/api/register", register);

// User login route
router.post("/api/login", login);
router.post("/api/logout", logout);

export default router;