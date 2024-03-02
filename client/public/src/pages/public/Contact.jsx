import {
  Box,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";

function Contact() {
  return (
    <Box minH="65vh" maxW="800px" mx="auto" py={10} px={4}>
      <Heading as="h2" size="xl" mb={6}>
        Contact Us
      </Heading>
      <Text>
        We would love to hear from you! Whether you have a question, feedback,
        or simply want to say hello, please feel free to reach out to us using
        the form below.
      </Text>
      <Flex direction="column" mt={8}>
        <FormControl id="name" isRequired mb={4}>
          <FormLabel>Your Name</FormLabel>
          <Input type="text" placeholder="Enter your name" />
        </FormControl>
        <FormControl id="email" isRequired mb={4}>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Enter your email address" />
        </FormControl>
        <FormControl id="message" isRequired mb={4}>
          <FormLabel>Message</FormLabel>
          <Textarea placeholder="Enter your message" rows={4} />
        </FormControl>
        <Button colorScheme="teal" size="lg">
          Send Message
        </Button>
      </Flex>
    </Box>
  );
}

export default Contact;
