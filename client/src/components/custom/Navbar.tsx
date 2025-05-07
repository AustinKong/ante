import { HStack, IconButton } from "@chakra-ui/react";
import { ChevronLeft } from "@mui/icons-material";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <HStack justifyContent="space-between" p="1" w="full">
      <IconButton variant="ghost" onClick={() => navigate(-1)}>
        <ChevronLeft />
      </IconButton>
      <ColorModeButton />
    </HStack>
  );
};

export default Navbar;
