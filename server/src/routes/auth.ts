import express from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import prisma from "../prisma";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    res.status(400).send("User already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400).send("Invalid password");
    return;
  }

  const accessToken = generateAccessToken({ email });
  const refreshToken = generateRefreshToken({ email });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).send("Refresh token not found");
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const email = (payload as { email: string }).email;
    const newAccessToken = generateAccessToken({ email });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).send("Invalid refresh token");
  }
});

export default router;
