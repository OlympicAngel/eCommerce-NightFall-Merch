import { Box, Flex, Link, Text, VStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" py={8} bg="gray.900" color="white">
      <Flex direction={{ base: 'column', md: 'row' }} maxW="7xl" mx="auto">
        <VStack flex="1" spacing={4} align={{ base: 'center', md: 'flex-start' }}>
          <Text fontSize="lg" fontWeight="bold">
            Luchia
          </Text>
          <Text>&copy; {new Date().getFullYear()} All rights reserved.</Text>
        </VStack>
        <VStack flex="1" spacing={4} align={{ base: 'center', md: 'flex-end' }}>
          <Link href="#">Home</Link>
          <Link href="#">About</Link>
          <Link href="#">Contact</Link>
        </VStack>
        <VStack flex="1" spacing={4} align={{ base: 'center', md: 'flex-end' }}>
          <Link href="#">Register</Link>
          <Link href="#">Login</Link>
          <Link href="#">Orders</Link>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
