import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import logger from "./middleware/logger";

const app = express();
const PORT = process.env.PORT;
dotenv.config();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(logger);

/* Routers */
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
