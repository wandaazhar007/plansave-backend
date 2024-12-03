import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/dbConfig.js";

const db = await connectDB();

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

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

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    res.status(200).send({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error logging in", error: err.message });
  }
};