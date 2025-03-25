import express from "express";
import authenticate from "../middleware/authenticate";
import {
  createGameRoom,
  getGameRoom,
  deleteGameRoom,
  joinGameRoom,
} from "../store/gameRooms";
import { createHost, createPlayer } from "../store/players";

const gameRouter = express.Router();

gameRouter.post("/create", authenticate, (req, res) => {
  const { maxPlayers } = req.body;

  const host = createHost();
  // FIXME: Hard coded for now
  const room = createGameRoom(maxPlayers, "poker");
  joinGameRoom(room.roomCode, host);

  res.status(201).json({
    room: room,
    player: host,
  });
});

gameRouter.post("/join", (req, res) => {
  const { roomCode } = req.body;
  const room = getGameRoom(roomCode);
  const player = createPlayer();

  if (!room) {
    res.status(404).send("Room not found");
    return;
  }

  if (!joinGameRoom(roomCode, player)) {
    res.status(400).send("Room is full");
    return;
  }

  res.status(200).json({
    room,
    player,
  });
});

export default gameRouter;
