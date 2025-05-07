import { Outlet } from "react-router-dom";
import Navbar from "@/components/custom/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
