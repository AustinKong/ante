import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate("/login")}>Login</Button>
      <Button onClick={() => navigate("/register")}>Login</Button>
      <Button onClick={() => navigate("/joinGame")}>Join Game</Button>
    </div>
  );
};

export default HomePage;
