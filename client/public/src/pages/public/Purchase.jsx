import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const PurchasePage = () => {
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);

  const [paymentsValues, setPaymentValues] = useState({
    credit: "",
    exp: "",
    cvv: "",
  });

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    building: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeCredit = (e) => {
    setPaymentValues({ ...paymentsValues, credit: e.target.value });
  };


  const placeOrder = async()=>{

    try {

      const {data : payment_status} = await axios.post('http://localhost:4000/payments/pay',{credit_number:paymentsValues.credit});

      setPayment(payment_status);

      try {

        const {data : order_status} = await axios.post('http://localhost:4000/orders/add',{
          customer_details: {
            customer_name: values.name,
            customer_email: values.email,
            customer_phone: values.phone,
            customer_address: {
              city: values.city,
              street: values.street,
              building: values.building,
            }
          },
          payment_details:{
            terminal_number: payment.terminal_number,
            transaction_number: payment.transaction_number,
            last_digits: payment.last_digits,
          },
          // products: cartItems.map((pr)=>{
          //   return {
          //     product: pr._id,
          //     RTP: pr.product_price,
          //     quantity: pr.quantity
          //   }
          // })
        });

        navigate('/')

        // setCartItems([])
        alert(`you order is placed, order number : ${order_status.order_number}`)

          
        
      } catch (error) {
        toast.error(error.response.data.error)
      }
      
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  return (
    <Box minH="65vh" maxW="90%" mx="auto" py={10} px={4}>
      <Heading as="h2" size="xl" mb={4}>
        Order Items
      </Heading>
      <Box mb={4}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th minW={170}>Quantity</Th>
              <Th>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* {cartItems.map((item) => (
              <Tr key={item._id}>
                <Td>{item.product_name}</Td>
                <Td>${item.product_price}</Td>
                <Td>
                  <Text mx={1.5} as="b">
                    {item.quantity}
                  </Text>
                </Td>
                <Td>${(item.quantity * item.product_price).toFixed(2)}</Td>
              </Tr>
            ))} */}
          </Tbody>
        </Table>
      </Box>
      <Heading as="h2" size="xl" mb={4}>
        Customer and Shipping Details
      </Heading>
      <Box mb={4}>
        <Flex direction="column" mb={4}>
          <Input
            onChange={handleChange}
            name="name"
            placeholder="Full Name"
            mb={2}
          />
          <Input
            onChange={handleChange}
            name="email"
            placeholder="Email"
            mb={2}
          />
          <Input
            onChange={handleChange}
            name="phone"
            placeholder="Phone"
            mb={2}
          />
          <Input
            onChange={handleChange}
            name="street"
            placeholder="Address"
            mb={2}
          />
          <Input
            onChange={handleChange}
            name="city"
            placeholder="City"
            mb={2}
          />
          <Input
            onChange={handleChange}
            name="building"
            placeholder="Building"
            mb={2}
          />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mb={4}>
        Credit Card Details
      </Heading>
      <Box mb={4}>
        {/* Credit card details */}
        <Flex direction="column" mb={4}>
          <Input
            onChange={handleChangeCredit}
            placeholder="Card Number"
            mb={2}
          />
          <Input placeholder="Expiration Date" mb={2} />
          <Input placeholder="CVV" mb={2} />
        </Flex>
      </Box>
      <Button onClick={placeOrder} colorScheme="teal">Place Order</Button>
    </Box>
  );
};

export default PurchasePage;
