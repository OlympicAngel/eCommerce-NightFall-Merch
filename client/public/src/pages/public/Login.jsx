import { Box, Heading, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

const Login = () => {
  return (
    <Box minH="65vh" maxW="600px" mx="auto" py={10} px={4}>
    <Heading as="h2" size="xl" mb={6}>
        Login
      </Heading>
      <FormControl id="email" isRequired mb={4}>
        <FormLabel>Email Address</FormLabel>
        <Input type="email" placeholder="Enter your email address" />
      </FormControl>
      <FormControl id="password" isRequired mb={4}>
        <FormLabel>Password</FormLabel>
        <Input type="password" placeholder="Enter your password" />
      </FormControl>
      <Button colorScheme="teal" size="lg" mb={4}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
