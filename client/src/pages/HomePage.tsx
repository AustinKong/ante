import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button onClick={() => navigate("/register")}>Register</Button>
      {localStorage.getItem("token") && (
        <Button onClick={() => navigate("/createRoom")}>Create Room</Button>
      )}
      <Button onClick={() => navigate("/joinRoom")}>Join Game</Button>
    </div>
  );
};

export default HomePage;
