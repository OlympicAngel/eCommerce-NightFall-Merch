import { Button, ButtonGroup, Flex, Box, border } from "@chakra-ui/react";
import { useState } from "react";
import { FaHamburger } from "react-icons/fa";
import { BiUserCircle, BiHomeCircle } from "react-icons/bi";

import { Link } from "react-router-dom";
// import ShoppingCart from "./ShoppingCart";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const nav_styles = {
    display: [isOpen ? "flex" : "none", "flex"],
    gap: 5,
    p: 7,
  };

  const button_styles = {
    top: [2, 1],
    left: 5,
    display: ["inherit", "none"],
  };

  const changeOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <Button onClick={changeOpen} sx={button_styles}>
        <FaHamburger />
      </Button>
      <Flex
        justifyContent="space-between"
        color={'white'}
        direction={["column", "row"]}
        sx={nav_styles}
      >
        <ButtonGroup>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <Link to="/">
              <BiHomeCircle />
            </Link>
          </Button>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <Link to="/about">about</Link>
          </Button>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <Link to="/contact">contact</Link>
          </Button>
        </ButtonGroup>
        <div /* style={{ position: "relative" }} */>
          <Box
            as={Link}
            to="/"
            style={{
              clipPath: "circle(50% at 50% 50%)",
              backgroundImage: "url('/public/logo.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "85px",
              height: "85px",
              position: "absolute",
              top: "0.8%",
            }}
          ></Box>
        </div>
        <ButtonGroup>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <BiUserCircle />
          </Button>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <Link to="/register">register</Link>
          </Button>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <Link to="/login">login</Link>
          </Button>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            <Link to="/orders">orders</Link>
          </Button>
          <Button
            sx={{
              _hover: {
                cursor: "pointer",
                border: "2px",
                borderColor: "white",
              },
              border: "none",
            }}
            variant="outline"
          >
            logout
          </Button>
          <Button
          sx={{
            _hover: {
              cursor: "pointer",
              border:'2px', borderColor:'white'
            },
            border:"none"
          }}
          variant="outline">
            {/* <ShoppingCart /> */}
          </Button>
        </ButtonGroup>
      </Flex>
    </div>
  );
}

export default Nav;
