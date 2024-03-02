import {
  HStack,
  Spinner,
  Box,
  Image,
  Text,
  Container,
  Heading,
  Button,
  Flex,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function Product() {
  const [num, setNum] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  const [qty, setQty] = useState(1);

  const increment = () => {
    setQty(qty + 1);
  };

  const decrement = () => {
    if (qty > 1) setQty(qty - 1);
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `http://localhost:4000/products/managers/product/${id}`
        );

        console.log(data);

        setProduct(data.product);
      } catch (error) {
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("chosen");
    };
  }, []);
  return (
    <>
      {loading && <Spinner />}
      {error && <p>{error}</p>}
      {product && (
        <>
          <Flex margin="0 auto" direction="column" maxW="80%">
            <Flex
              minH="65vh"
              maxW="100%"
              mx="auto"
              py={10}
              px={4}
              align="center"
            >
              <Box width="80%">
                <Image src={product.product_image} alt="Product Image" />
              </Box>
              <Box ml={4}>
                <Heading as="h2" size="lg" mb={2}>
                  {product.product_name}
                </Heading>
                <Divider mb={2} />
                <Text mb={2}>{product.product_description}</Text>
                <Text fontWeight="bold" mb={2}>
                  ${product.product_price}
                </Text>
              </Box>
            </Flex>

            <Flex>
              <Button onClick={increment}>+</Button>
              <Text> {qty} </Text>
              <Button onClick={decrement}>-</Button>
              <Button
                mb={10}
                colorScheme="blue"
                size="lg"
              >
                Add to Cart
              </Button>
            </Flex>
            
            <Link to={`/#${id}`}>
              <Button>
              Go Back
              </Button>
            </Link>
          </Flex>
        </>
      )}
    </>
  );
}

export default Product;
