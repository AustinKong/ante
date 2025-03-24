import { v4 as uuidv4 } from "uuid";

export type Player = {
  id?: string;
  username: string;
  isHost: boolean;
};

export function createHost(): Player {
  const host = createPlayer();
  return { ...host, isHost: true };
}

export function createPlayer(): Player {
  const id = uuidv4();
  const username = generateUsername();
  return { id, username, isHost: false };
}

function generateUsername(): string {
  const adjectives = ["happy", "sad", "angry", "sleepy", "hungry"];
  const nouns = ["dog", "cat", "bird", "fish", "rabbit"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}-${noun}`;
}
