import { Request, Response, NextFunction } from "express";

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    `[${new Date().toLocaleString()}] ${req.ip} ${req.method} @ ${req.url}`
  );
  next();
}

export default logger;
