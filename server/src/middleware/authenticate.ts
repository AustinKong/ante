import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";

export interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Missing or invalid Authorization header");
    return;
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const { email } = verifyAccessToken(accessToken) as { email: string };
    req.user = { email };
    next();
  } catch (err) {
    res.status(401).send("Invalid access token");
  }
}

export default authenticate;
