import express from "express";
import authenticate from "../middleware/authenticate";
import { createRoom, getRoom } from "../rooms/rooms";
import { generateRoomToken, verifyRoomToken } from "../utils/token";

/**
 * ==================================================================================
 * PLAYER FLOW - ROOM CREATION AND JOINING PROCESS
 * ==================================================================================
 *
 * 1. Host Room Creation:
 *    - Host sends a POST request to `/api/game` to create a new room.
 *    - Server creates a room, assigns the host as the initial player, and reserves their spot for 1 minute.
 *    - Response includes `roomCode`, `roomToken`, and initial player info.
 *
 * 2. Host Customization:
 *    - Host is redirected to the customization page with the `roomToken`.
 *    - Host updates their username and avatar.
 *    - Host submits a POST request to `/api/game/:roomCode/join` with `roomToken`, `username`, and `avatar`.
 *    - Server verifies the token and updates the player's info.
 *    - Host is then redirected to the game page.
 *
 * 3. Host Connection:
 *    - On the game page, a WebSocket connection is initiated with the `roomToken`.
 *    - Server verifies the token and establishes the connection.
 *
 * 4. Non-Host Room Reservation:
 *    - Non-host sends a GET request to `/api/game/:roomCode/validate`.
 *    - Server checks room availability, reserves a spot, and generates a `roomToken`.
 *    - Response includes `roomToken` and initial player info.
 *
 * 5. Non-Host Customization:
 *    - Non-host is redirected to the customization page with the `roomToken`.
 *    - Non-host updates their username and avatar.
 *    - Non-host submits a POST request to `/api/game/:roomCode/join` with `roomToken`, `username`, and `avatar`.
 *    - Server verifies the token and updates the player's info.
 *    - Non-host is then redirected to the game page.
 *
 * 6. Non-Host Connection:
 *    - On the game page, WebSocket connection is established using the `roomToken`.
 *    - Server verifies the token and connects the player to the game.
 */

const gameRouter = express.Router();

gameRouter.post("/", authenticate, (req, res) => {
  const { roomType, maxPlayers } = req.body;

  const room = createRoom(roomType || "poker", maxPlayers);
  const host = room.getNewPlayer(true);

  const roomToken = generateRoomToken({
    roomCode: room.roomCode,
    playerId: host.id,
  });

  room.reserve(host);
  res.status(201).json({
    roomCode: room.roomCode,
    roomToken,
    player: host,
  });
});

gameRouter.post("/:roomCode/join", (req, res) => {
  const { roomCode } = req.params;
  const { username, avatar, roomToken } = req.body;
  const room = getRoom(roomCode);

  if (!room) {
    res.status(404).send("Room not found");
    return;
  }

  const { playerId } = verifyRoomToken(roomToken) as {
    roomCode: string;
    playerId: string;
  };
  const player = room.getPlayer(playerId);

  if (!player) {
    res.status(404).send("Player not found");
    return;
  }

  player.updateInfo(username, avatar);
  res.sendStatus(201);
});

gameRouter.get("/:roomCode/validate", (req, res) => {
  const { roomCode } = req.params;
  const room = getRoom(roomCode);

  if (!room) {
    res.status(404).send("Room not found");
    return;
  }

  const player = room.getNewPlayer(false);

  if (room.isFull()) {
    res.status(400).send("Room is full");
    return;
  }

  const roomToken = generateRoomToken({ roomCode, playerId: player.id });
  room.reserve(player);
  res.status(200).json({ roomCode, roomToken, player });
});

export default gameRouter;
