import { Routes, Route } from "react-router-dom";

import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import JoinRoomPage from "@/pages/JoinRoomPage";
import CreateRoomPage from "@/pages/CreateRoomPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/joinRoom" element={<JoinRoomPage />} />
      <Route path="/createRoom" element={<CreateRoomPage />} />
      <Route path="/game/:roomCode" element={<GamePage />} />
    </Routes>
  );
}

export default App;
