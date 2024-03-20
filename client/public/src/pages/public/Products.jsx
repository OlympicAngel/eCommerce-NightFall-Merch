import { Button, Grid } from "@chakra-ui/react";
import useQueryLogic from "../../hooks/useQueryLogic";
import { useContext } from "react";
import { CartContext } from "../../context/CartProvider";
import useTitle from "../../hooks/useTitle";
import ProductCard from "../../components/Product/ProductCard";


function Products() {
  useTitle("ראשי")

  const queryLogic = useQueryLogic({
    key: "products",
    urlPath: "products",
  })
  const products = queryLogic.data || []


  const { addToCart, getCartPrice, OpenCart } = useContext(CartContext)

  //TODO: pagination? sorts
  return (<>
    סך הכל: {getCartPrice()}
    <Grid className="grid">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </Grid>
    <Button colorScheme="red" onClick={() => OpenCart()}>עבור לתשלום</Button>
  </>
  )
}

export default Products