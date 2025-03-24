import express from "express";
import authenticate from "../middleware/authenticate";
import {
  createGameRoom,
  getGameRoom,
  deleteGameRoom,
} from "../store/gameRooms";

const gameRouter = express.Router();

gameRouter.post("/create", authenticate, (req, res) => {
  const room = createGameRoom();
  res.status(201).json({ roomCode: room.code });
});

gameRouter.post("/join", (req, res) => {});

export default gameRouter;
