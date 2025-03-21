import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
  throw new Error("JWT_SECRET is not defined in the environment variables");

const users: { email: string; password: string }[] = [];

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (users[email]) {
    res.status(400).send("User already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400).send("Invalid password");
    return;
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

export default router;
