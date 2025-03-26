import express from "express";
import authenticate from "../middleware/authenticate";
import { createRoom, getRoom } from "../rooms/rooms";
import { Player } from "../players/Player";
import { generateRoomToken } from "../utils/token";

const gameRouter = express.Router();

gameRouter.post("/create", authenticate, (req, res) => {
  const { roomType, maxPlayers } = req.body;

  const host = new Player(true);
  const room = createRoom(roomType || "poker", maxPlayers);

  const roomToken = generateRoomToken({
    roomCode: room.roomCode,
    playerId: host.id,
  });
  room.reserve(host);

  res.status(201).json({
    roomCode: room.roomCode, // Required for host to share with friends
    roomToken,
  });
});

gameRouter.post("/join", (req, res) => {
  const { roomCode } = req.body;
  const room = getRoom(roomCode);

  if (!room) {
    res.status(404).send("Room not found");
    return;
  }

  const player = new Player();

  if (room.isFull()) {
    res.status(400).send("Room is full");
    return;
  }

  const roomToken = generateRoomToken({ roomCode, playerId: player.id });
  room.reserve(player);

  res.status(200).json({
    roomToken,
  });
});

export default gameRouter;
