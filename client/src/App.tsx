import { Routes, Route } from "react-router-dom";

import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import JoinRoomPage from "@/pages/JoinRoomPage";
import CreateRoomPage from "@/pages/CreateRoomPage";
import GamePage from "@/pages/GamePage";
import DebugPage from "@/pages/DebugPage";

function App() {
  return (
    <Routes>
      <Route element={<DebugPage />} path="/debug" />
      <Route element={<HomePage />} path="/" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<JoinRoomPage />} path="/joinRoom" />
      <Route element={<CreateRoomPage />} path="/createRoom" />
      <Route element={<GamePage />} path="/game/:roomCode" />
    </Routes>
  );
}

export default App;
