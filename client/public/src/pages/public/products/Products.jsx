import ProductCard from "../../../components/partials/products/ProductCard";
import axios from "axios";
import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";

// import { CartContext } from "../../../context/CartContext";

function Products() {
  const { SERVER } = useContext(AuthContext)

  const { isLoading, isError, error, data } = useQuery(
    {
      queryKey: ["getProducts"],
      queryFn: async () => await axios(SERVER + "products"),
      select: (res) => res.data.products, //filter data to get only needed part
      staleTime: 1000 * 60, //dont send request (use cache) if not older then 60 sec
      refetchInterval: 1000 * 60,
      retry: 0
    }
  );
  const products = data || [];


  // const { addToCart } = useContext(CartContext);


  return (
    <>
      <Box minH="65vh" maxW="90%" mx="auto" py={10} px={4}>
        <Heading as="h2" size="xl" mb={6}>
          Home
        </Heading>
        <Text my={5}>
          Welcome to our online store, your one-stop destination for beautifully
          hand-knitted baby and children items. We are passionate about creating
          high-quality, unique, and cozy products that bring joy to both little
          ones and their parents.
        </Text>
        <Box
          as="video"
          src="/public/homepage_video.mp4"
          alt="home page video"
          objectFit="cover"
          width="100%"
          sx={{
            aspectRatio: "16/9",
            maxH: "250px",
          }}
          autoPlay
          muted
          loop
        ></Box>
        <Flex flexWrap="wrap" my={5} justifyContent="space-between">
          {products?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            //  addToCart={addToCart}
            />
          ))}
        </Flex>
      </Box>
    </>
  );
}

export default Products;
