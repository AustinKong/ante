import { Routes, Route } from "react-router-dom";

import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import JoinRoomPage from "@/pages/JoinRoomPage";
import CreateRoomPage from "@/pages/CreateRoomPage";
import GamePage from "@/pages/GamePage";
import PlayerCustomizationPage from "@/pages/PlayerCustomizationPage";
import Layout from "@/components/custom/Layout";

function App() {
  return (
    <Routes>
      <Route element={<GamePage />} path="/game/:roomCode" />

      <Route element={<RegisterPage />} path="/register" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<HomePage />} path="/" />

      <Route element={<Layout />}>
        <Route element={<JoinRoomPage />} path="/joinRoom" />
        <Route element={<CreateRoomPage />} path="/createRoom" />
        <Route
          element={<PlayerCustomizationPage />}
          path="/game/:roomCode/playerCustomization"
        />
      </Route>
    </Routes>
  );
}

export default App;
