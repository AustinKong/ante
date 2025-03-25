import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createSocket } from "./socket";

import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth";
import logger from "./middleware/logger";
import gameRouter from "./routes/game";

dotenv.config();

const app = express(); // Express app
const httpServer = createServer(app); // Http server wrapper
const socket = createSocket(httpServer); // Socket.io

/* Middleware */
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

/* Routers */
app.use("/api/auth", authRouter);
app.use("/api/game", gameRouter);

socket.listen();

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
