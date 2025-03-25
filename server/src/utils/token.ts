import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not set in environment variables");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not set in environment variables");
}

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as string, { expiresIn: "1h" });
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): object | string {
  return jwt.verify(token, ACCESS_TOKEN_SECRET as string);
}

export function verifyRefreshToken(token: string): object | string {
  return jwt.verify(token, REFRESH_TOKEN_SECRET as string);
}
