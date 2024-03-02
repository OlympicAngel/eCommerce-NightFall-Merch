import {
  Box,
  Center,
  Heading,
  Text,
  Divider,
  Stack,
  Image,
  CardBody,
  Card,
  CardFooter,
  ButtonGroup,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Box boxShadow="lg" p="6" rounded="md" bg="white" maxW="xs" my={10}>
      <Center >
      <div id={product._id} >
      <Card >
          <CardBody >
            <Image
              onClick={() => {
                navigate(`/product/${product._id}`);
              }}
              style={{ cursor: "pointer" }}
              maxH={100}
              src={product.product_image}
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="sm">{product.product_name}</Heading>
              <Text w={250} fontSize="xs" overflowY="hidden" height={150}>
                {product.product_description}
              </Text>
              <Text color="blue.600" fontSize="2xl">
                ${product.product_price}
              </Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing="2">
              <Button variant="solid" colorScheme="teal">
                Buy now
              </Button>
              <Button
                variant="ghost"
                colorScheme="teal"
                onClick={() => {
                  // addToCart(product);
                }}
              >
                Add to cart
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </div>
      </Center>
    </Box>
  );
}

export default ProductCard;
