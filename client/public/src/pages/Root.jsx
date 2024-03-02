import { Outlet } from "react-router-dom";
import Nav from "../components/sections/Nav";
import Footer from "../components/sections/Footer";


function Root() {


  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

export default Root