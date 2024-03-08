import { Box, Heading, Text } from "@chakra-ui/react";
import { PayPalButtons } from "@paypal/react-paypal-js";


function About() {

  function createOrder(data, actions) {
    console.log(data, actions)
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "test",
          items: [
            //TODO: convert cart to paypal form
            {
              name: "a",
              quantity: 10,
              unit_amount: {
                currency_code: "ILS",
                value: 1,
              }
            }
          ],
          amount: {
            currency_code: "ILS",
            value: 10.0, //TODO total
            breakdown: {
              item_total: {
                currency_code: "ILS",
                value: 10, //TODO total
              }
            }
          }
        }
      ]
    })
  }


  return (
    <Box maxW="800px" mx="auto" py={10} px={4}>
      <Box m={"auto"} textAlign={"center"} >
        <PayPalButtons createOrder={createOrder} style={{ layout: "horizontal" }} />
      </Box>

      <Heading as="h2" size="xl" mb={6}>
        About Us
      </Heading>
      <Text my={5}>
        At Luchia, we understand that every child deserves warmth,
        comfort, and style. That's why we meticulously craft each item with love
        and care, using only the finest materials. Our dedicated team of skilled
        artisans brings years of experience and a deep understanding of the art
        of knitting to create adorable and functional pieces that will keep your
        little ones snug and stylish.
      </Text>
      <Text my={5}>
        What sets us apart is our commitment to quality and attention to detail.
        We believe that the magic lies in the little things, and it reflects in
        every stitch we make. From soft and delicate blankets and cozy hats to
        charming sweaters and cute booties, our collection showcases a range of
        hand-knitted treasures that will make your child feel cherished and
        loved.
      </Text>
      <Text my={5}>
        We also prioritize the safety and well-being of your little ones. All
        our products are made using baby-friendly, hypoallergenic materials,
        ensuring that they are gentle on delicate skin. We understand the
        importance of providing a nurturing environment for your children, and
        our items are designed with their comfort and happiness in mind.
      </Text>
    </Box>
  );
}

export default About;
