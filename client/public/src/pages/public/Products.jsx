import BuyButton from "../../components/BuyButton";
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import useQueryLogic from "../../hooks/useQueryLogic";
import { useContext } from "react";
import { CartContext } from "../../context/CartProvider";
import { set, ref, update } from "firebase/database"
import { rtDB } from "../../../firebase.config";
import useTitle from "../../hooks/useTitle";


function Products() {
  useTitle("ראשי")

  const queryLogic = useQueryLogic({
    key: "products",
    urlPath: "products",
  })
  const products = queryLogic.data || []


  const { addToCart, getCartPrice } = useContext(CartContext)
  return (<>
    סך הכל: {getCartPrice()}
    <Flex gap={"1em"} justifyContent={"space-between"} textAlign={"center"} wrap={"wrap"}>
      {products.map(p => <Box key={p._id}>
        <Heading>{p.name}</Heading>
        <Button onClick={() => addToCart(p)}>הוסף לסל</Button>
      </Box>)}
    </Flex>
    <BuyButton></BuyButton>
  </>
  )
}

export default Products