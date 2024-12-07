import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/DbConfig.js";

const db = await connectDB();

export const register = async (req, res) => {
  const { email, name, password } = req.body;

  // Check if all fields are provided
  if (!email || !password || !name) {
    return res.status(400).send({ message: "All fields are required." });
  }

  try {
    // Check if email already exists
    const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).send({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the user into the database
    const [result] = await db.execute(
      "INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [email, hashedPassword, name]
    );

    res.status(201).send({ message: "User registered successfully!", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error registering user", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required." });
  }

  try {
    // Check if the user exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = rows[0];

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Send success response
    res.status(200).send({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error logging in", error: err.message });
  }
};