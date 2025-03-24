import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import logger from "./middleware/logger";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

/* Routers */
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
