import { v4 as uuidv4 } from "uuid";

export class Player {
  id: string;
  username: string;
  isHost: boolean;
  avatar: number;

  constructor(isHost = false, username?: string) {
    this.id = uuidv4();
    this.username = username || generateUsername();
    this.isHost = isHost;
    this.avatar = 0;
  }

  updateInfo(username: string, avatar: number) {
    this.username = username;
    this.avatar = avatar;
  }

  serialize() {
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      isHost: this.isHost,
    };
  }
}

function generateUsername(): string {
  const adjectives = ["happy", "sad", "angry", "sleepy", "hungry"];
  const nouns = ["dog", "cat", "bird", "fish", "rabbit"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}-${noun}`;
}
